import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './admin/AuthContext'

// Public site — eagerly loaded
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Gallery from './components/Gallery'
import FindUs from './components/FindUs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'

// Admin — lazy loaded so Supabase SDK doesn't bloat the public bundle
const Login       = lazy(() => import('./admin/Login'))
const Dashboard   = lazy(() => import('./admin/Dashboard'))
const MenuManager = lazy(() => import('./admin/MenuManager'))
const Orders      = lazy(() => import('./admin/Orders'))
const Contacts    = lazy(() => import('./admin/Contacts'))

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="font-display text-2xl" style={{ color: '#FF6B35' }}>Loading...</div>
    </div>
  )
}

function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <About />
        <Gallery />
        <FindUs />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthed, isLoading } = useAuth()
  if (isLoading) return <AdminFallback />
  return isAuthed ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/admin/login"     element={<Login />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/menu"      element={<ProtectedRoute><MenuManager /></ProtectedRoute>} />
            <Route path="/admin/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin/contacts"  element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="/admin"           element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
