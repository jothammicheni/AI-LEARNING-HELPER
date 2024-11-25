import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import ActiveUser from '../../customHook/getLoggedInUser';
import { User } from '../../interfaces/Types';

interface Course {
  id: number;
  title: string;
  description: string;
  coverPath: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const coursesPerPage = 6;
  const BACKEND_URL = "http://localhost:5007";
  const { user} = ActiveUser();
  console.log('hello:',user?.role)
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/course/getCourses`);
        setCourses(response.data);
        setFilteredCourses(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const results = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(results);
    setCurrentPage(1);
  }, [searchTerm, courses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
     <div className='flex max-sm:flex-col'>
     <div className="mb-6 relative w-full mr-2">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-14 p-2 pl-3 pr-10 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
      </div>
       
     { user?.role=='admin'?(
      <div className='bg-teal-600 h-14 items-center justify-center rounded-md  mb-2 cursor-pointer'>
         <p className='text-white text-center'>Manage Courses</p>
      </div>
     ):(
      <p></p>
     )
      }
     </div>
      <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">All Courses</h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <img
              src={`${BACKEND_URL}${course.coverPath}`}
              alt={course.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg?height=192&width=384';
              }}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-teal-700 mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm">
                {course.description.length > 100
                  ? `${course.description.substring(0, 100)}...`
                  : course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {filteredCourses.length > coursesPerPage && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          <span className="text-teal-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-teal-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}