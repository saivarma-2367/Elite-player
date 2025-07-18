import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchSlots, bookSlot } from '../api/authApi'; // Your API methods
import './slotBooking.css';
import NavBar from '../../../shared/NavBar';
import SideBar from '../../../shared/SideBar';

const COURTS = ['Court1', 'Court2', 'Court3', 'Court4', 'Court5'];

function SlotBooking({ user }) {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchSlots();
      const calendarEvents = data.map((slot) => ({
        id: slot._id,
        title: `${slot.courtId} - Booked`,
        start: new Date(slot.slotTime),
        end: new Date(new Date(slot.slotTime).getTime() + 60 * 60 * 1000),
        backgroundColor: 'tomato',
        borderColor: 'darkred',
        textColor: 'white',
        extendedProps: { courtId: slot.courtId },
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error loading slots:', err);
    }
  };

  function getNormalizedTime(date) {
    const normalized = new Date(date);
    normalized.setMinutes(0, 0, 0);
    return normalized.toISOString();
  }

  const isValidBookingHour = (date) => {
    const hour = new Date(date).getHours();
    return (hour >= 9 && hour < 12) || (hour >= 18 && hour < 21);
  };

  const handleBookingForTime = async (clickedTimeISOString) => {
    const bookedCourtsAtTime = events
      .filter((event) => getNormalizedTime(event.start) === clickedTimeISOString)
      .map((event) => event.extendedProps.courtId);

    const availableCourts = COURTS.filter(
      (court) => !bookedCourtsAtTime.includes(court)
    );

    if (availableCourts.length === 0) {
      alert('All courts are booked at this time.');
      return;
    }

    const courtSelection = prompt(
      `Courts already booked: ${bookedCourtsAtTime.join(', ') || 'None'}\n` +
        `Available courts:\n${availableCourts
          .map((c, i) => `${i + 1}. ${c}`)
          .join('\n')}\n\nEnter court number to book:`
    );

    const selectedIndex = parseInt(courtSelection, 10) - 1;
    const selectedCourt = availableCourts[selectedIndex];

    if (!selectedCourt) {
      alert('Invalid selection.');
      return;
    }

    try {
      await bookSlot({
        courtId: selectedCourt,
        playerId: user.id,
        slotTime: clickedTimeISOString,
        sport: 'tennis',
      });

      alert(`Slot successfully booked on ${selectedCourt}`);
      await loadEvents(); 
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book slot.');
    }
  };

  const handleDateClick = async (info) => {
    if (!isValidBookingHour(info.date)) {
      alert('Booking allowed only between 9–12 AM or 6–9 PM');
      return;
    }
    const clickedTime = getNormalizedTime(info.date);
    await handleBookingForTime(clickedTime);
  };

  const handleEventClick = async (info) => {
    if (!isValidBookingHour(info.event.start)) {
      alert('Booking allowed only between 9–12 AM or 6–9 PM');
      return;
    }
    const clickedTime = getNormalizedTime(info.event.start);
    await handleBookingForTime(clickedTime);
  };

  return (
    <div>
      <NavBar />
      <SideBar />
      <div style={{ marginLeft: 120, marginTop: 50 }}>
        <h1>Welcome, {user.userName}</h1>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotDuration="01:00:00"
          slotMinTime="09:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          events={events}
          selectable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek',
          }}
          height="auto"
        />
      </div>
    </div>
  );
}

export default SlotBooking;
