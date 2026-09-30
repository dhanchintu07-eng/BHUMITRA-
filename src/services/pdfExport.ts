import jsPDF from 'jspdf';
import { Crop, UserFarmingConditions } from '../types';

export function exportCropAdvisoryPDF(
  conditions: UserFarmingConditions,
  topCrops: Crop[],
  aiInsight: string,
  locationLabel?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Background Header Banner
  doc.setFillColor(6, 95, 70); // Deep Emerald #065f46
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 4, 4, 'F');

  // Brand Name & Logo Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BHUMITRA (भूमिमित्र / ಭೂಮಿತ್ರ)', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Smart Crop Decisions. Better Harvests. | ICAR-Aligned Advisory Report', margin + 6, y + 17);

  // Report Date & ID
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const reportId = 'BHU-' + Math.floor(100000 + Math.random() * 900000);

  doc.setFontSize(8);
  doc.text(`Date: ${reportDate}  |  Report ID: ${reportId}`, margin + 6, y + 23);

  y += 34;

  // Section 1: Farmer & Field Agro-Climatic Parameters
  doc.setFillColor(248, 250, 245);
  doc.setDrawColor(209, 250, 229);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 38, 3, 3, 'FD');

  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. FARM & AGRO-CLIMATIC FIELD CONDITIONS', margin + 5, y + 7);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const col1X = margin + 5;
  const col2X = margin + 65;
  const col3X = margin + 125;

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Location / State:', col1X, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.location || locationLabel || 'India'}`, col1X + 30, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Soil Type:', col2X, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.soilType.toUpperCase()} Soil`, col2X + 22, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Cropping Season:', col3X, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.season.toUpperCase()}`, col3X + 32, y + 15);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.text('Average Rainfall:', col1X, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.rainfall} mm`, col1X + 30, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Irrigation Status:', col2X, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.waterAvailability.toUpperCase()}`, col2X + 26, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Farm Area Size:', col3X, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${conditions.landSize || 1} ${conditions.landUnit || 'Acres'}`, col3X + 32, y + 24);

  // Soil brief note
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('* Soil texture and drainage suitability evaluated against ICAR national database standards.', col1X, y + 33);

  y += 44;

  // Section 2: Top Recommended Crops
  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. TOP RECOMMENDED CROPS (SUITABILITY RANKING)', margin, y);

  y += 4;

  // Table Header
  const tableX = margin;
  const tableWidth = pageWidth - margin * 2;
  const rowHeight = 8;

  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.roundedRect(tableX, y, tableWidth, rowHeight, 1.5, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  doc.text('Rank', tableX + 3, y + 5.5);
  doc.text('Crop Name', tableX + 16, y + 5.5);
  doc.text('Match', tableX + 56, y + 5.5);
  doc.text('Water Need', tableX + 76, y + 5.5);
  doc.text('Duration', tableX + 106, y + 5.5);
  doc.text('Yield / Acre', tableX + 132, y + 5.5);
  doc.text('NPK Ratio', tableX + 158, y + 5.5);

  y += rowHeight + 1;

  // Table Body Rows
  topCrops.slice(0, 3).forEach((crop, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(tableX, y, tableWidth, 9, 1, 1, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);

    // Rank & Name
    doc.text(`#${idx + 1}`, tableX + 4, y + 6);
    doc.text(`${crop.name}`, tableX + 16, y + 6);

    // Match %
    doc.setTextColor(5, 150, 105);
    doc.text(`${crop.suitabilityPercentage}%`, tableX + 57, y + 6);

    // Water & Duration & Yield
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`${crop.waterNumericMm || 500} mm`, tableX + 76, y + 6);
    doc.text(`${crop.growingDuration}`, tableX + 106, y + 6);
    doc.text(`${crop.avgYieldPerAcre}`, tableX + 132, y + 6);

    // NPK
    const npk = crop.nutrients ? `${crop.nutrients.nitrogen}:${crop.nutrients.phosphorus}:${crop.nutrients.potassium}` : '100:50:40';
    doc.text(npk, tableX + 158, y + 6);

    y += 10;
  });

  y += 4;

  // Section 3: Key Actionable Farming & Seed Treatment Tips
  doc.setTextColor(6, 78, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. ACTIONABLE FIELD ADVISORY FOR RECOMMENDED CROPS', margin, y);

  y += 5;

  topCrops.slice(0, 3).forEach((crop, idx) => {
    doc.setFillColor(254, 252, 232); // Amber-50
    doc.setDrawColor(254, 240, 138); // Amber-200
    doc.roundedRect(margin, y, pageWidth - margin * 2, 17, 2, 2, 'FD');

    doc.setTextColor(146, 64, 14); // Amber-800
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`Crop #${idx + 1}: ${crop.name} Advisory:`, margin + 4, y + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    const splitTip = doc.splitTextToSize(crop.farmingTip, pageWidth - margin * 2 - 8);
    doc.text(splitTip, margin + 4, y + 10);

    y += 19;
  });

  y += 2;

  // Section 4: AI Strategic Agronomist Insight
  if (aiInsight) {
    doc.setFillColor(236, 253, 245); // Emerald-50
    doc.setDrawColor(167, 243, 208); // Emerald-200
    doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2.5, 2.5, 'FD');

    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('BHUMITRA AI STRATEGIC SOIL & MOISTURE ADVICE:', margin + 4, y + 6);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitAi = doc.splitTextToSize(`"${aiInsight}"`, pageWidth - margin * 2 - 8);
    doc.text(splitAi, margin + 4, y + 12);

    y += 27;
  }

  // Footer Disclaimer & Verification
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: Recommendations serve as digital decision-support. Periodic laboratory soil testing at your nearest Krishi Vigyan Kendra (KVK) is advised.',
    margin,
    pageHeight - 10
  );
  doc.text('Generated by BHUMITRA (ಭೂಮಿತ್ರ) · Verified Open Agronomy Protocol', margin, pageHeight - 6);

  // Trigger browser download
  const safeLocation = (conditions.location || 'Farm').replace(/[^a-zA-Z0-9]/g, '_');
  const safeSeason = (conditions.season || 'Crop').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`BHUMITRA_Advisory_Report_${safeLocation}_${safeSeason}.pdf`);
}
