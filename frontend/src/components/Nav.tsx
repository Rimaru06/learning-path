import { NavLink, useNavigate } from "react-router-dom";
import { useUser, DEMO_USERS } from "../context/UserContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/goals", label: "Goals" },
  { to: "/learning-path", label: "Learning Path" },
  { to: "/topics", label: "My Topics" },
];

export function Nav() {
  const { userId, setUserId } = useUser();
  const navigate = useNavigate();

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-4">
        <span className="font-bold text-gray-900 text-sm tracking-tight shrink-0">
          🎯 Learning Path
        </span>
        <nav aria-label="Main navigation" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <label className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:inline">User</span>
          <select
            value={userId}
            onChange={handleUserChange}
            aria-label="Switch demo user"
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50
                       text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400
                       cursor-pointer"
          >
            {DEMO_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Mobile nav row */}
      <div className="sm:hidden border-t border-gray-100">
        <ul className="flex overflow-x-auto px-4 gap-1 py-1">
          {links.map(({ to, label }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-xs rounded-lg font-medium transition-colors whitespace-nowrap inline-block ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
