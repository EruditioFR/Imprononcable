import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { GalleryPage } from '../pages/GalleryPage';
import { ProcessCreatif } from '../pages/ProcessCreatif';
import { ProcessCreatifDetailPage } from '../pages/ProcessCreatifDetailPage';
import { ProcessCreatifManagementPage } from '../pages/ProcessCreatifManagementPage';
import { EditProcessCreatifPage } from '../pages/EditProcessCreatifPage';
import { AddProcessCreatif } from '../pages/AddProcessCreatif';
import { EditUserPage } from '../pages/EditUserPage';
import { UsersPage } from '../pages/UsersPage';
import { BlogPage } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { BlogManagementPage } from '../pages/BlogManagementPage';
import { CreateBlogPage } from '../pages/CreateBlogPage';
import { EditBlogPage } from '../pages/EditBlogPage';
import { ImageBankPage } from '../pages/ImageBankPage';
import { ImageBankAdminPage } from '../pages/ImageBankAdminPage';
import { AddImagePage } from '../pages/AddImagePage';
import { EditImagePage } from '../pages/EditImagePage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { Header } from './Layout/Header';
import { Navigation } from './Layout/Navigation';
import { Footer } from './Layout/Footer';
import { LoginForm } from './Auth/LoginForm';
import { RoleGuard } from './RoleGuard';
import { useAuth } from '../contexts/AuthContext';

export default function AppContent() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/banque-images" element={<GalleryPage />} />
            <Route path="/ressources" element={<ProcessCreatif />} />
            <Route path="/ressources/:id" element={<ProcessCreatifDetailPage />} />
            <Route path="/ensemble" element={<BlogPage />} />
            <Route path="/ensemble/:id" element={<BlogPostPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin"
              element={
                <RoleGuard requiredRole="Administrateur">
                  <AdminDashboardPage />
                </RoleGuard>
              }
            />
            <Route 
              path="/ressources/manage" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <ProcessCreatifManagementPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ressources/edit/:id" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <EditProcessCreatifPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ressources/add" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <AddProcessCreatif />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ensemble/manage" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <BlogManagementPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ensemble/create" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <CreateBlogPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/ensemble/edit/:id" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <EditBlogPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/banque-images/admin"
              element={
                <RoleGuard requiredRole="Administrateur">
                  <ImageBankAdminPage />
                </RoleGuard>
              }
            />
            <Route 
              path="/banque-images/add"
              element={
                <RoleGuard requiredRole="Administrateur">
                  <AddImagePage />
                </RoleGuard>
              }
            />
            <Route 
              path="/banque-images/edit/:id"
              element={
                <RoleGuard requiredRole="Administrateur">
                  <EditImagePage />
                </RoleGuard>
              }
            />
            <Route 
              path="/users" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <UsersPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/users/create" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <EditUserPage />
                </RoleGuard>
              } 
            />
            <Route 
              path="/users/:userId" 
              element={
                <RoleGuard requiredRole="Administrateur">
                  <EditUserPage />
                </RoleGuard>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export { AppContent }