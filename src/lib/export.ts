import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { AppState, DailyRecord } from '../types'
import { getSortedRecords } from './recovery'
import { formatDisplayDate } from './utils'

function recordToRow(r: DailyRecord): Record<string, string | number | boolean> {
  return {
    日期: r.date,
    静息疼痛: r.painRest,
    走路疼痛: r.painWalking,
    按压疼痛: r.painPress,
    晨僵: r.morningStiffness,
    肿胀: r.swelling,
    负重: `${r.weightBearing}%`,
    步数: r.steps,
    步行时间: `${r.walkingMinutes}分钟`,
    训练时间: `${r.trainingMinutes}分钟`,
    备注: r.notes,
    恢复评分: r.aiScore ?? '',
  }
}

export function exportJSON(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `recovery-tracker-${state.config.injuryDate}.json`)
}

export function exportExcel(state: AppState): void {
  const records = getSortedRecords(state.records)
  const rows = records.map(recordToRow)
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '康复记录')
  XLSX.writeFile(wb, `recovery-tracker-${state.config.injuryDate}.xlsx`)
}

export function exportPDF(state: AppState): void {
  const { config } = state
  const records = getSortedRecords(state.records)
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text('StepBack 康复报告', 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`受伤日期: ${formatDisplayDate(config.injuryDate)}`, 14, 32)
  doc.text(`损伤类型: ${config.injuryType}`, 14, 39)
  doc.text(`记录天数: ${records.length} 天`, 14, 46)
  doc.text(`生成日期: ${formatDisplayDate(new Date().toISOString().split('T')[0])}`, 14, 53)

  const milestones = state.milestones.filter((m) => m.unlockedAt)
  if (milestones.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('里程碑', 14, 66)
    doc.setFontSize(10)
    milestones.forEach((m, i) => {
      doc.text(`${m.icon} ${m.title} — ${m.unlockedAt}`, 14, 74 + i * 7)
    })
  }

  const tableStart = milestones.length > 0 ? 74 + milestones.length * 7 + 10 : 65
  autoTable(doc, {
    startY: tableStart,
    head: [['日期', '疼痛', '负重', '步数', '评分', '备注']],
    body: records.slice(-30).map((r) => [
      r.date,
      `${r.painRest}/${r.painWalking}/${r.painPress}`,
      `${r.weightBearing}%`,
      String(r.steps),
      String(r.aiScore ?? '-'),
      r.notes.slice(0, 30),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  doc.save(`recovery-report-${config.injuryDate}.pdf`)
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}