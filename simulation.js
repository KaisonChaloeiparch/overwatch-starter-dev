/**
 * OVERWATCH | Reality Anchoring (RAG) Simulation
 * Secret Mission 1: Bangkok High-Risk Sector Data
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/incidents';
const INTERVAL = 5000; // 5 seconds

// Real-world dangerous/congested intersections in Bangkok (2024-2025)
const SECTORS = [
    {
        name: 'แยกอโศก-เพชรบุรี',
        text: 'ตรวจพบเหตุรถชนกันรุนแรงบริเวณแยกอโศก-เพชรบุรี การจราจรเป็นอัมพาต 100%',
        lat: 13.7485,
        lng: 100.5644
    },
    {
        name: 'ห้าแยกลาดพร้าว',
        text: 'รายงานเพลิงไหม้รถเมล์บริเวณห้าแยกลาดพร้าว ควันพวยพุ่งสูง เจ้าหน้าที่กำลังเข้าพื้นที่',
        lat: 13.8167,
        lng: 100.5619
    },
    {
        name: 'แยกพระราม 9',
        text: 'ตรวจพบวัตถุต้องสงสัยคล้ายระเบิดวางทิ้งไว้บริเวณทางขึ้น MRT พระราม 9',
        lat: 13.7570,
        lng: 100.5645
    },
    {
        name: 'แยกสาทร-สุรศักดิ์',
        text: 'อุบัติเหตุรถบรรทุกน้ำมันพลิกคว่ำบนทางด่วนช่วงแยกสาทร-สุรศักดิ์ มีน้ำมันรั่วไหล',
        lat: 13.7188,
        lng: 100.5198
    },
    {
        name: 'แยกประตูน้ำ',
        text: 'น้ำท่วมฉับพลันระดับฟุตบาทบริเวณแยกประตูน้ำ รถเล็กไม่สามารถผ่านได้',
        lat: 13.7533,
        lng: 100.5398
    }
];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function emitNeuralSignal() {
    const sector = SECTORS[getRandomInt(SECTORS.length)];

    console.log('\n--- [REALITY ANCHOR EMISSION] ---');
    console.log(`[SECTOR]: ${sector.name}`);
    console.log(`[DATA]: "${sector.text}"`);

    try {
        const response = await axios.post(API_URL, {
            text: sector.text,
            latitude: sector.lat,
            longitude: sector.lng
        });
        const { id, type, priority } = response.data;

        console.log(`[SUCCESS]: REALITY SIGNAL PERSISTED.`);
        console.log(`[RESULT]: ID: ${id.substring(0, 8)} | TYPE: ${type} | PRIORITY: ${priority}`);
        console.log(`[COORDS]: ${sector.lat}, ${sector.lng}`);
        console.log(`[TIME]: ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        console.error(`[ERROR]: TRANSMISSION FAILED.`);
        if (error.response) {
            console.error(`[REASON]: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`[REASON]: ${error.message}`);
        }
    }
    console.log('--------------------------------');
}

console.log('--- OVERWATCH RAG SIMULATION ENGINE STARTED ---');
console.log(`--- TARGET: ${API_URL} ---`);
console.log(`--- MODE: REAL-WORLD DATA ANCHORING ---`);

// Start global pulse
setInterval(emitNeuralSignal, INTERVAL);

// First broadcast
emitNeuralSignal();
