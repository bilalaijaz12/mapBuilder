import MapComponent from '../Map/MapComponent'

function Layout() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <MapComponent />
    </div>
  )
}

export default Layout