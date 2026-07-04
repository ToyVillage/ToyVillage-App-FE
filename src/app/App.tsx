import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { NoticeListPage, CreateNoticePage } from '@/pages/notice'

// 라우트 정의(app 레이어). 페이지는 pages 레이어에서 가져온다.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/notice" element={<NoticeListPage />} />
      <Route path="/notice/create" element={<CreateNoticePage />} />
    </Routes>
  )
}
