import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.replace('/', '');

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-white dark:bg-[#1a1a27] p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
        <h2 className="text-3xl font-bold text-[#11191f] dark:text-white capitalize mb-4">
          {pageName} Page
        </h2>
        <p className="text-gray-500 dark:text-[#8a8a9e]">
          This page is currently under construction.
        </p>
      </div>
    </div>
  );
}
