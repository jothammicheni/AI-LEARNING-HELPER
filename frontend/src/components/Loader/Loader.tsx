import React from 'react';
import ReactDOM from 'react-dom';
import LoaderImage from '../../assets/Loading.gif';

const Loader = () => {
  return ReactDOM.createPortal(
    <div className='fixed inset-0 bg-grey-300 bg-opacity-30 flex justify-center items-center z-50'>
      <div className='flex justify-center'>
        <img src={LoaderImage} alt='Loading...' className='w-24 h-auto' />
      </div>
    </div>,
    document.getElementById("loader")!
  );
};

export default Loader;
