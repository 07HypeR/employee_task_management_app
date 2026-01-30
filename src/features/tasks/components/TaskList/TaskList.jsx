import React, { useRef, useState } from "react";
import TaskCard from "../TaskCard/TaskCard";

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    role="img"
    aria-label="New tasks icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    role="img"
    aria-label="Active tasks icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shrink-0"
    aria-label={`Scroll ${direction === "left" ? "left" : "right"}`}
  >
    <svg
      className={`w-5 h-5 ${direction === "right" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

const ScrollContainer = ({
  items,
  onTaskUpdate,
  emptyMessage,
  visibleCount,
  onShowMore,
  onCollapse,
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] text-gray-400 italic font-medium">
        {emptyMessage}
      </div>
    );
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const isFullyExpanded = visibleCount >= items.length && items.length > 5;

  return (
    <div className="space-y-4">
      <div className="relative group/scroll">
        <div className="absolute -top-16 right-0 flex gap-2 sm:opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleItems.map((task) => (
            <div
              key={task._id}
              className="snap-start shrink-0 w-full sm:w-[350px]"
            >
              <TaskCard task={task} onUpdate={onTaskUpdate} />
            </div>
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onShowMore}
            className="px-6 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 font-bold text-sm rounded-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all active:scale-95 flex items-center gap-2"
            aria-label={`Show more tasks, ${items.length - visibleCount} remaining`}
          >
            <span>Show More</span>
            <span className="text-xs text-emerald-400">
              ({items.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}

      {isFullyExpanded && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onCollapse}
            className="px-6 py-3 bg-gray-600/10 hover:bg-gray-600/20 text-gray-400 hover:text-gray-300 font-bold text-sm rounded-xl border border-gray-500/20 hover:border-gray-500/30 transition-all active:scale-95 flex items-center gap-2"
            aria-label="Collapse task list"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span>Collapse</span>
          </button>
        </div>
      )}
    </div>
  );
};

const TaskList = ({ data, onTaskUpdate }) => {
  const tasks = data?.tasks || [];
  const [pendingVisible, setPendingVisible] = useState(5);
  const [activeVisible, setActiveVisible] = useState(5);

  const pending = tasks.filter((task) => task.newTask);
  const active = tasks.filter((task) => task.active);

  return (
    <div className="mt-16 space-y-16 pb-16">
      <section aria-labelledby="new-invitations-heading">
        <div className="flex items-center gap-4 mb-8">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10"
          >
            <ClockIcon />
          </div>
          <div>
            <h3
              id="new-invitations-heading"
              className="text-xl sm:text-2xl font-bold text-white leading-tight"
            >
              New Invitations
            </h3>
            <p className="text-sm text-gray-400 font-medium">
              Respond to incoming task assignments ({pending.length} total)
            </p>
          </div>
        </div>

        <ScrollContainer
          items={pending}
          onTaskUpdate={onTaskUpdate}
          emptyMessage="No new requests at the moment."
          visibleCount={pendingVisible}
          onShowMore={() => setPendingVisible((prev) => prev + 5)}
          onCollapse={() => setPendingVisible(5)}
        />
      </section>

      <section aria-labelledby="active-workload-heading">
        <div className="flex items-center gap-4 mb-8">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10"
          >
            <PlayIcon />
          </div>
          <div>
            <h3
              id="active-workload-heading"
              className="text-xl sm:text-2xl font-bold text-white leading-tight"
            >
              Active Workload
            </h3>
            <p className="text-sm text-gray-400 font-medium">
              Tasks currently in progress ({active.length} total)
            </p>
          </div>
        </div>

        <ScrollContainer
          items={active}
          onTaskUpdate={onTaskUpdate}
          emptyMessage="Ready for more challenges? Accept a task above."
          visibleCount={activeVisible}
          onShowMore={() => setActiveVisible((prev) => prev + 5)}
          onCollapse={() => setActiveVisible(5)}
        />
      </section>
    </div>
  );
};

export default TaskList;
