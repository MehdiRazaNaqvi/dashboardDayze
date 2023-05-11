import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const EventListItem = ({ event, onDelete, onEdit, now }) => {
    const [timeSinceEvent, setTimeSinceEvent] = useState('');

    useEffect(() => {
        const updateTimeSinceEvent = () => {
const eventDateTime = new Date(Math.floor(event.date.toDate().getTime() / 1000) * 1000);
const timeDiff = eventDateTime - now;

            const isPastEvent = timeDiff < 0;
            const isFutureEvent = timeDiff > 0;

            const days = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((Math.abs(timeDiff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((Math.abs(timeDiff) % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((Math.abs(timeDiff) % (1000 * 60)) / 1000);

            if (isPastEvent) {
                setTimeSinceEvent(`${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`);
            } else if (isFutureEvent) {
                setTimeSinceEvent(`in ${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`);
            } else {
                setTimeSinceEvent("Now");
            }
        };

        updateTimeSinceEvent();

        const interval = setInterval(() => {
            updateTimeSinceEvent();
        }, 1000);

        return () => clearInterval(interval);
    }, [event, now]);

    return (
        <div className="event-item">
            <p className="event-title">{event.title}</p>
            <p className="event-time">{timeSinceEvent}</p>
            <Button onClick={() => onDelete(event.id)}>Delete</Button>
        </div>
    );
};

const YourEvents = ({ events, onDelete, onEdit, now }) => {
    return (
      <div>
        <h3>Your Events</h3>
        <ul className="event-list">
          {events.map((event, index) => (
            <EventListItem
              key={index}
              event={event}
              now={now} // Pass the now prop here
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </div>
    );
  };

export default YourEvents;
