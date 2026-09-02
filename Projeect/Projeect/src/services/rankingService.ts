import { Hospital, SeverityLevel } from '../types';

export interface SmartRankingResult {
  hospital: Hospital;
  smartScore: number; // 0 - 100
  breakdown: {
    distanceScore: number;
    waitTimeScore: number;
    erBedScore: number;
    icuBedScore: number;
    specialistScore: number;
    loadScore: number;
  };
  highlightReason: string;
}

export class SmartRankingService {
  /**
   * Evaluates and ranks all hospitals for a specific emergency scenario
   */
  static rankHospitals(
    hospitals: Hospital[],
    requiredSpecialty: string = 'Emergency Medicine',
    severity: SeverityLevel = 'URGENT'
  ): SmartRankingResult[] {
    const results = hospitals.map(hosp => {
      // 1. Distance & ETA Score (0 - 25 pts)
      // Closest (<3km) gets 25 pts, decays with distance
      const distanceScore = Math.max(0, Math.min(25, Math.round(25 - (hosp.distanceKm * 2.2))));

      // 2. Wait Time Score (0 - 20 pts)
      // Lower wait times score higher (e.g. 5 min wait gets 20, 60 min wait gets 2)
      const waitTimeScore = Math.max(2, Math.min(20, Math.round(20 - (hosp.estimatedWaitMinutes * 0.3))));

      // 3. ER Bed Availability Score (0 - 20 pts)
      const erBedScore = Math.min(20, (hosp.erBedsAvailable >= 5 ? 20 : hosp.erBedsAvailable * 4));

      // 4. ICU Bed Availability (0 - 15 pts) - Crucial for CRITICAL
      let icuBedScore = Math.min(15, (hosp.icuBedsAvailable >= 3 ? 15 : hosp.icuBedsAvailable * 5));
      if (severity === 'CRITICAL' && hosp.icuBedsAvailable === 0) {
        icuBedScore = 0; // Huge penalty for critical patients if no ICU bed
      }

      // 5. Specialist Match Score (0 - 10 pts)
      const specs = hosp.specialistsOnDuty || hosp.doctors.map(d => d.specialty) || [];
      const hasDirectSpecialist = specs.some((s: string) => 
        s.toLowerCase().includes(requiredSpecialty.toLowerCase()) || 
        requiredSpecialty.toLowerCase().includes(s.toLowerCase())
      );
      const specialistScore = hasDirectSpecialist ? 10 : (hosp.facilities?.hasTraumaCenterLevel1 ? 7 : 4);

      // 6. Current Hospital Load Score (0 - 10 pts)
      // Under 60% load gets 10 pts, >90% gets 2 pts
      const loadScore = Math.max(1, Math.min(10, Math.round(10 - ((hosp.currentLoadPercent - 40) * 0.18))));

      // Total Smart Score
      let totalScore = distanceScore + waitTimeScore + erBedScore + icuBedScore + specialistScore + loadScore;
      totalScore = Math.min(99, Math.max(45, totalScore));

      // Dynamic Highlight Reason
      const eta = hosp.etaMinutes || Math.round(hosp.distanceKm * 2.2);
      let highlightReason = '';
      if (totalScore >= 90) {
        highlightReason = `Top Smart Match: ${hosp.distanceKm} km away (${eta} min ETA) • ${hosp.icuBedsAvailable} ICU beds & ${hosp.erBedsAvailable} ER bays ready • ${specs[0] || 'Cardiologist'} on duty.`;
      } else if (totalScore >= 80) {
        highlightReason = `High Capacity: ${hosp.erBedsAvailable} ER beds open • ${hosp.estimatedWaitMinutes} min predicted wait time.`;
      } else {
        highlightReason = `Standard Triage option • Distance ${hosp.distanceKm} km (${eta} min).`;
      }

      return {
        hospital: {
          ...hosp,
          smartScore: totalScore,
          recommendedReason: highlightReason
        },
        smartScore: totalScore,
        breakdown: {
          distanceScore,
          waitTimeScore,
          erBedScore,
          icuBedScore,
          specialistScore,
          loadScore
        },
        highlightReason
      };
    });

    // Sort descending by Smart Score
    return results.sort((a, b) => b.smartScore - a.smartScore);
  }
}
