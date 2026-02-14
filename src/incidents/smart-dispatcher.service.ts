import { Injectable } from '@nestjs/common';

export interface Hospital {
    name: string;
    distanceKm: number;
    availableBeds: number;
    totalBeds: number;
}

export interface Patient {
    id: string;
    condition: string;
    priority: 'CRITICAL' | 'URGENT' | 'STABLE';
}

@Injectable()
export class SmartDispatcherService {
    /**
     * ตรรกะการตัดสินใจเลือกโรงพยาบาลสำหรับผู้ป่วยวิกฤต
     * Priority: Capacity (ความสามารถในการรับคน) > Distance (ระยะทาง)
     */
    findBestHospital(patient: Patient, hospitals: Hospital[]): { hospital: Hospital; reasoning: string } {
        if (hospitals.length === 0) {
            throw new Error('No hospitals available in the sector.');
        }

        // คะแนนเริ่มต้น (Scoring System)
        const scoredHospitals = hospitals.map((h) => {
            let score = 0;

            // 1. ระยะทาง (ระยะทางน้อย = คะแนนมาก)
            // Max distance assumed 10km for local dispatch
            score += (10 - Math.min(h.distanceKm, 10)) * 10;

            // 2. ความจุเตียง (Capacity)
            const occupancyRate = (h.totalBeds - h.availableBeds) / h.totalBeds;

            if (patient.priority === 'CRITICAL') {
                // สำหรับเคสวิกฤต เตียงว่างสำคัญที่สุด (Critical Weighting)
                if (h.availableBeds === 0) {
                    score -= 1000; // ตัดสิทธิ์ทันทีหากเตียงเต็ม
                } else {
                    score += (h.availableBeds / h.totalBeds) * 200; // ให้คะแนนความว่างสูงมาก
                }
            } else {
                // เคสปกติ เน้นระยะทางมากกว่า
                score += h.availableBeds > 0 ? 50 : 0;
            }

            return { hospital: h, score };
        });

        // เรียงลำดับตามคะแนนสูงสุด
        const best = scoredHospitals.sort((a, b) => b.score - a.score)[0];

        // สร้างเหตุผลประกอบ (Reasoning)
        let reasoning = '';
        if (patient.priority === 'CRITICAL') {
            if (best.hospital.availableBeds > 0) {
                reasoning = `ตัดสินใจเลือก ${best.hospital.name} เนื่องจากมีเตียงว่างรองรับวิกฤต (${best.hospital.availableBeds} เตียง) แม้ระยะทางจะอยู่ที่ ${best.hospital.distanceKm} กม. เพื่อเลี่ยงความล่าช้าจากการส่งต่อผู้ป่วย (Transfer Delay)`;
            } else {
                reasoning = `คำเตือน: ทุกโรงพยาบาลในพื้นที่เต็มกำลังการผลิต แต่ ${best.hospital.name} ถูกเลือกเป็นลำดับแรกตามเกณฑ์ระยะทาง`;
            }
        } else {
            reasoning = `เลือก ${best.hospital.name} เนื่องจากเป็นจุดที่ใกล้ที่สุด (${best.hospital.distanceKm} กม.) สำหรับเคสที่ไม่วิกฤต`;
        }

        return { hospital: best.hospital, reasoning };
    }
}
