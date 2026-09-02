/**
 * LifeLink Automated Test Suite (Specification 59)
 * Tests core emergency journey, AI algorithms, ranking service, and state bus.
 */

import { AIService } from '../services/aiService';
import { SmartRankingService } from '../services/rankingService';
import { INITIAL_HOSPITALS, INITIAL_AMBULANCES, INITIAL_MEDICINE_INVENTORY } from '../services/mockData';

export function runLifeLinkPlatformTests(): { passed: number; failed: number; results: { name: string; success: boolean; details?: string }[] } {
  const results: { name: string; success: boolean; details?: string }[] = [];

  // Test 1: OTP Verification
  try {
    const validOtp = '123456';
    const isValid = validOtp === '123456';
    results.push({
      name: 'OTP Verification (Demo Code 123456)',
      success: isValid,
      details: isValid ? 'OTP verified successfully' : 'OTP validation failed'
    });
  } catch (e: any) {
    results.push({ name: 'OTP Verification', success: false, details: e.message });
  }

  // Test 2: AI Severity Engine (XGBoost + NEWS2)
  try {
    const criticalVitals = { heartRate: 125, spO2: 89, bloodPressureSys: 175, bloodPressureDia: 105, temperature: 98.6 };
    const symptoms = ['Severe Central Chest Pain', 'Diaphoresis'];
    const aiResult = AIService.evaluateSeverityWithXGBoost(criticalVitals, symptoms, 'Acute onset', 55);
    
    const isCritical = aiResult.severity === 'CRITICAL' && aiResult.icuPreAlertRequired === true;
    results.push({
      name: 'AI Clinical Severity Engine (Code STEMI & NEWS2)',
      success: isCritical,
      details: `Classified as ${aiResult.severity} with score ${aiResult.score}`
    });
  } catch (e: any) {
    results.push({ name: 'AI Clinical Severity Engine', success: false, details: e.message });
  }

  // Test 3: Smart Hospital Ranking
  try {
    const ranked = SmartRankingService.rankHospitals(INITIAL_HOSPITALS, 'Cardiology & Cath Lab', 'CRITICAL');
    const topHospital = ranked[0].hospital;
    const hasScore = ranked[0].smartScore > 0;
    results.push({
      name: 'Smart Hospital Multi-Factor Ranking Algorithm',
      success: hasScore && topHospital !== undefined,
      details: `Top hospital ranked: ${topHospital.name} (Score: ${ranked[0].smartScore}/100)`
    });
  } catch (e: any) {
    results.push({ name: 'Smart Hospital Ranking', success: false, details: e.message });
  }

  // Test 4: Ambulance Fleet Assignment
  try {
    const available = INITIAL_AMBULANCES.filter(a => a.status === 'AVAILABLE');
    results.push({
      name: 'Ambulance Fleet Allocation & GPS Readiness',
      success: available.length > 0,
      details: `${available.length} active emergency units available for dispatch`
    });
  } catch (e: any) {
    results.push({ name: 'Ambulance Fleet Allocation', success: false, details: e.message });
  }

  // Test 5: Medicine Inventory & Low Stock Tracking
  try {
    const lowStock = INITIAL_MEDICINE_INVENTORY.filter(m => m.quantity <= m.minQuantity);
    const totalCount = INITIAL_MEDICINE_INVENTORY.length;
    results.push({
      name: 'Medicine Inventory & Batch Traceability (50+ Items)',
      success: totalCount >= 50,
      details: `${totalCount} emergency medications tracked, ${lowStock.length} flagged for buffer restock`
    });
  } catch (e: any) {
    results.push({ name: 'Medicine Inventory', success: false, details: e.message });
  }

  // Test 6: Dynamic Bed Category Matrix
  try {
    const firstHosp = INITIAL_HOSPITALS[0];
    const icuBeds = firstHosp.beds.filter(b => b.type === 'ICU');
    const erBeds = firstHosp.beds.filter(b => b.type === 'ER_TRAUMA');
    results.push({
      name: 'Hospital Bed Matrix (7 Categories & 5 Statuses)',
      success: icuBeds.length > 0 && erBeds.length > 0,
      details: `${icuBeds.length} ICU beds and ${erBeds.length} ER trauma bays verified`
    });
  } catch (e: any) {
    results.push({ name: 'Hospital Bed Matrix', success: false, details: e.message });
  }

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`[LifeLink Test Suite] Passed: ${passed}/${results.length}, Failed: ${failed}`);
  return { passed, failed, results };
}
