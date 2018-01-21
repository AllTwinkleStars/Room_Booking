import React from 'react'
import BookingFormTable from './BookingFormTable'
import Datetime from 'react-datetime'
import moment from 'moment'
import formatTime from '../helpers/bookingForm'

const BookingForm = props => {

  const valid = function(current) {
    return current.day() !== 0
  }

  // Array used for handleData function
  let dateArray = []

  // Takes the momentJS date object and converts it to an Array
  // eg. 2018-04-12 => [2018, 4, 12]
  const handleDate = event => {
    const date = moment(event).format('Y M D')

    // Update the current date in the application state
    props.updateCalendar(moment(event)._i)

    // Prepare a date array to make the booking
    dateArray = date.split(' ').map(item => parseInt(item, 10))
    dateArray[1] = dateArray[1] - 1
    return dateArray
  }

  var spanStyle = {
    color: 'blue'
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        // Data from input
        const formData = event.target.elements
        const roomId = props.roomData._id
        // startDate data
        const startTime = formatTime(formData.startTime.value)
        const startDate = [...dateArray, ...startTime]
        // endDate data
        const endTime = formatTime(formData.endTime.value)
        const endDate = [...dateArray, ...endTime]

        const businessUnit = formData.business.value
        const purpose = formData.purpose.value
        const description = formData.description.value
        props.onMakeBooking({ startDate, endDate, businessUnit, purpose, roomId })
      }}
    >
      <h2>{props.roomData.name}</h2>
      <h2>
        Room ID: <span style={spanStyle}>{props.roomData._id}</span>
      </h2>
      <h2>Date: {moment(props.date).format('YYYY-MM-DD')}</h2>
      <div className="date-container">
        <div className="left-container">
          <Datetime
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            input={false}
            utc={true}
            isValidDate={valid}
            onChange={event => handleDate(event._d)}
          />
        </div>

        <div className="middle-container">
          <BookingFormTable 
            roomData={props.roomData} 
            date={ props.date } />
        </div>

        <div className="right-container">
          <h3>Make a Booking</h3>
          <div className="time-selector">
            <label>
              {'Start Time: '}
              <input type="time" name="startTime" min="00:00" max="23:00" />
            </label>

            <label>
              {'End Time: '}
              <input type="time" name="endTime" min="00:00" max="23:00" />
            </label>
          </div>
          <label>
            {'Business Unit:'}
            <select name="business" defaultValue="Business Unit 1">
              <option value="Business Unit 1">Business Unit 1</option>
              <option value="Business Unit 2">Business Unit 2</option>
              <option value="Business Unit 3">Business Unit 3</option>
              <option value="Business Unit 4">Business Unit 4</option>
              <option value="Business Unit 5">Business Unit 5</option>
            </select>
          </label>

          <label>
            {'Purpose:'}
            <select name="purpose" defaultValue="Scheduled Class">
              <option value="Scheduled Class">Scheduled Class</option>
              <option value="Special Event">Special Event</option>
              <option value="Ad-hoc Event">Ad-hoc Event</option>
            </select>
          </label>
          <div className="time-selector">
            <label>
              {'Description'}
              <input type="textarea" name="description" />
            </label>
          </div>
          <button className="custom-button filter-button">Submit</button>
        </div>
      </div>
    </form>
  )
}

export default BookingForm
