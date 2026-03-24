import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import AdminRoutes from "./router/AdminRoutes"
import StudentRoutes from "./router/StudentRoutes"
import PublicRoutes from "./router/PublicRoutes"


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {PublicRoutes()}
          {AdminRoutes()}
          {StudentRoutes()}

        </Route>
      </Routes>
    </>
  )
}

export default App