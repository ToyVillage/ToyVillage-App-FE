import { Navigate, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import {
  CreateNoticePage,
  NoticeDetailPage,
  NoticeGuidePage,
  NoticeListPage,
  NoticeResourcesPage,
  NoticeReservationsPage,
} from '@/pages/notice'

// 라우트 정의(app 레이어). 페이지는 pages 레이어에서 가져온다.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/notices"
        element={<Navigate to="/notices/list" replace />}
      />
      <Route path="/notices/list" element={<NoticeListPage />} />
      <Route path="/notices/list/create" element={<CreateNoticePage />} />
      <Route path="/notices/list/:id" element={<NoticeDetailPage />} />
      <Route path="/notices/guide" element={<NoticeGuidePage />} />
      <Route path="/notices/resources" element={<NoticeResourcesPage />} />
      <Route
        path="/notices/reservations"
        element={<NoticeReservationsPage />}
      />
    </Routes>
  )
}
