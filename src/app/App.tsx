import { Navigate, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import {
  CreateNoticePage,
  NoticeDetailPage,
  NoticeListPage,
} from '@/pages/notices/notice'
import {
  CreateResourcePage,
  ResourceDetailPage,
  ResourceListPage,
} from '@/pages/notices/resources'
import {
  CreateCloseSchedulePage,
  NoticeGuidePage,
} from '@/pages/notices/guide'
import { NoticeReservationsPage } from '@/pages/notices/reservations'
import { Sidebar, SidebarToggleButton } from '@/features/sidebar'

// 라우트 정의(app 레이어). 페이지는 pages 레이어에서 가져온다.
export function App() {
  return (
    <>
      <SidebarToggleButton />
      <Sidebar />
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
        <Route
          path="/notices/guide/create"
          element={<CreateCloseSchedulePage />}
        />
        <Route path="/notices/resources" element={<ResourceListPage />} />
        <Route
          path="/notices/resources/create"
          element={<CreateResourcePage />}
        />
        <Route path="/notices/resources/:id" element={<ResourceDetailPage />} />
        <Route
          path="/notices/reservations"
          element={<NoticeReservationsPage />}
        />
      </Routes>
    </>
  )
}
