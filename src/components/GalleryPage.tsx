{
  // Add an admin button to the GalleryPage component
}
{isAdmin && (
  <Link
    to="/banque-images/admin"
    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
  >
    <Settings className="h-5 w-5 mr-2" />
    Gérer les images
  </Link>
)}