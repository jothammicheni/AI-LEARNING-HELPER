import React, { useEffect, useState } from "react";
import ProgressBar from "../progressBar/ProgressBar";
import CourseImage from "../../assets/courseImg.png";
import { FaComment, FaQuestionCircle } from "react-icons/fa";
import { BsFillChatDotsFill, BsFillFileLockFill } from "react-icons/bs";
import axios from "axios";

// Helper function to format the date
const formatDate = (date: Date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const isToday = now.toDateString() === commentDate.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    commentDate.toDateString();

  if (isToday) {
    return `Today, ${commentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else if (isYesterday) {
    return `Yesterday, ${commentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else {
    return commentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
};

// TypeScript types for clarity
interface CourseData {
  id: number;
  title: string;
  coverPath?: string;
  isCompleted: boolean;
  progress: number;
  dateCompleted?: Date;
  lastAccessed?: Date;
}

interface Course {
  id: number;
  title: string;
  image: string;
  dateCompleted?: Date;
  lastAccessed?: Date;
}

interface Courses {
  completed: Course[];
  inProgress: Course[];
  pending: Course[];
}

const Dashboard = () => {
  const x = 100;
  const BACKEND_URL = "http://localhost:5007"; // Updated BACKEND_URL

  const [comments, setComments] = useState([
    {
      author: "James",
      date: new Date(),
      text: "I recommend taking courses from these platforms.",
    },
    {
      author: "Kelvin",
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      text: "Great course content!",
    },
    {
      author: "Sarah",
      date: new Date("2024-11-01T10:00:00"),
      text: "Very informative and helpful!",
    },
  ]);

  const [questions, setQuestions] = useState([
    "How can I improve my skills in React?",
    "Where can I find more advanced Python tutorials?",
  ]);

  const [courses, setCourses] = useState<Courses>({
    completed: [],
    inProgress: [],
    pending: [],
  });

  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/course/enrolledCourses`
      );
      const allCourses: CourseData[] = response.data.courses;

      // Filter and categorize courses
      const completedCourses = allCourses.filter(
        (course) => course.isCompleted === true
      );
      const inProgressCourses = allCourses.filter(
        (course) => course.isCompleted === false 
      );
      const pendingCourses = allCourses.filter(
        (course) => course.isCompleted === false && course.progress === 0
      );

      setCourses({
        completed: completedCourses.map((course) => ({
          id: course.id,
          title: course.title,
          dateCompleted: course.dateCompleted || new Date(),
          image: course.coverPath || '/courseImg.png',
        })),
        inProgress: inProgressCourses.map((course) => ({
          id: course.id,
          title: course.title,
          image: course.coverPath || '/courseImg.png',
        })),
        pending: pendingCourses.map((course) => ({
          id: course.id,
          title: course.title,
          lastAccessed: course.lastAccessed || new Date(),
          image: course.coverPath || '/courseImg.png',
        })),
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const addComment = () => {
    const newComment = {
      author: "New User",
      date: new Date(),
      text: "This is a new comment.",
    };
    setComments([...comments, newComment]);
  };

  const addQuestion = () => {
    const newQuestion = "This is a new question?";
    setQuestions([...questions, newQuestion]);
  };

  // Helper function to render course cards
  const renderCourseCard = (course: Course, type: 'inProgress' | 'pending' | 'completed') => {
    console.log(`Rendering ${type} course:`, course);
    const imageUrl = course.image.startsWith('http') ? course.image : `${BACKEND_URL}${course.image}`;
    console.log("Image URL:", imageUrl);

    return (
      <div
        key={course.id}
        className="w-64 flex-shrink-0 p-4 flex flex-col items-center bg-white border border-gray-200 shadow-lg rounded-lg"
      >
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg"
          // onError={(e) => {
          //   console.error("Error loading image:", e);
          //   e.currentTarget.src = CourseImage; 
          // }}
        />
        <h4 className="text-sm font-medium mt-4">{course.title}</h4>
        {type === 'completed' && (
          <p className="text-xs text-gray-500">
            Completed on: {formatDate(course.dateCompleted as Date)}
          </p>
        )}
        {type === 'pending' && (
          <p className="text-xs text-gray-500">
            Last Accessed: {formatDate(course.lastAccessed as Date)}
          </p>
        )}
        {type !== 'completed' && (
          <button className="mt-2 bg-teal-600 text-white py-2 px-4 rounded-md">
            {type === 'inProgress' ? 'Continue' : 'Start Again'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-6 p-6 h-screen bg-gray-100 text-gray-900">
      {/* Course Overview and Sections on the Left */}
      <div className="w-full lg:w-3/5 overflow-y-auto space-y-4">
        <div className="w-full p-6 rounded-lg shadow-lg bg-white border border-gray-200">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            Course Overview
          </h3>
          <div className="flex flex-wrap gap-6 w-full justify-between">
            <ProgressBar
              text={`${
                courses.completed.length +
                courses.inProgress.length +
                courses.pending.length
              }`}
              value={x}
              title="Enrolled"
            />
            <ProgressBar
              text={`${courses.completed.length}`}
              value={x}
              title="Completed"
            />
            <ProgressBar
              text={`${courses.inProgress.length}`}
              value={x}
              title="In Progress"
            />
            <ProgressBar
              text={`${courses.pending.length}`}
              value={x}
              title="Pending"
            />
          </div>
        </div>

        {/* In Progress Courses */}
        <div className="w-full p-6 bg-white border border-gray-200 mt-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            In Progress
          </h3>
          <div className="flex overflow-x-auto gap-4">
            {courses.inProgress.map((course) => renderCourseCard(course, 'inProgress'))}
          </div>
        </div>

        {/* Pending Courses */}
        <div className="w-full p-6 bg-white border border-gray-200 mt-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Pending</h3>
          <div className="flex overflow-x-auto gap-4">
            {courses.pending.map((course) => renderCourseCard(course, 'pending'))}
          </div>
        </div>

        {/* Completed Courses */}
        <div className="w-full p-6 bg-white border border-gray-200 mt-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            Completed
          </h3>
          <div className="flex overflow-x-auto gap-4">
            {courses.completed.map((course) => renderCourseCard(course, 'completed'))}
          </div>
        </div>
      </div>

      {/* Popular Comments & Questions on the Right */}
      <div className="bg-gray-50 w-full lg:w-2/5 p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col h-full">
        <h2 className="text-lg font-semibold text-teal-600 mb-4 flex items-center">
          <BsFillChatDotsFill className="mr-2" /> Popular Comments
        </h2>
        <div className="overflow-y-auto space-y-4 h-full max-h-[50vh] pr-2">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="bg-white shadow p-3 rounded-lg hover:bg-teal-50"
            >
              <h3 className="text-sm font-semibold">{comment.author}</h3>
              <p className="text-xs text-gray-500">
                {formatDate(comment.date)}
              </p>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
          <button
            onClick={addComment}
            className="bg-teal-600 text-white mt-2 px-4 py-2 rounded-md"
          >
            Add Comment
          </button>
        </div>

        <h2 className="text-lg font-semibold text-teal-600 mb-4 flex items-center mt-6">
          <FaQuestionCircle className="mr-2" /> Popular Questions
        </h2>
        <div className="overflow-y-auto space-y-4 h-full max-h-[50vh] pr-2">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white shadow p-3 rounded-lg hover:bg-teal-50"
            >
              <p className="text-gray-700">{question}</p>
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="bg-teal-600 text-white mt-2 px-4 py-2 rounded-md"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;