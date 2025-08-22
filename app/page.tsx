import { ProtectedRoute } from './components/ProtectedRoute';
import HomeContent from './components/HomeContent';

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
