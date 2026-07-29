import { UsersView } from './UsersView'
import './index.css'

export default function Demo() {
  return (
    <div className="roster-demo">
      <div className="roster-demo__inner">
        <header className="roster-demo__masthead">
          <h1 className="roster-demo__title">Roster</h1>
        </header>
        <UsersView />
      </div>
    </div>
  )
}
