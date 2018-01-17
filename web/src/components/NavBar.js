import React from 'react'

function NavBar({
  signOut,
  loadMyBookings,
  user
}) {
  return (
    <nav className="nav">
      <div className="nav-left">
        {/* <a className="brand" href="/">Room System</a> */}

          <li id="brand">Room Booking System</li>
        <ul>
          <li><a onClick={signOut}>Logout</a></li>
        </ul>

        <ul>
          <li><a onClick={loadMyBookings}>My Bookings</a></li>
          <li>View Availability</li>
        </ul>

      </div>
    </nav>
  )
}

export default NavBar