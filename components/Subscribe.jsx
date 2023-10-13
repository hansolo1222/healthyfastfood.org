import React, { useRef, useState } from 'react';

export function Subscribe() {
  // 1. Create a reference to the input so we can fetch/clear it's value.
  const inputEl = useRef(null);
  // 2. Hold a message in state to handle the response from our API.
  const [message, setMessage] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();

    // 3. Send a request to our API with the user's email address.
    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl.current.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const { error } = await res.json();

    if (error) {
      // 4. If there was an error, update the message in state.
      setMessage(error);

      return;
    }

    // 5. Clear the input value and show a success message.
    inputEl.current.value = '';
    setMessage('Success! 🎉 You will get the latest updates.');
  };

  return (
    // <form onSubmit={subscribe} className="text-white">
    //   <label htmlFor="email-input">{'Email Address'}</label>
    //   <input
    //     id="email-input"
    //     name="email"
    //     placeholder="you@awesome.com"
    //     ref={inputEl}
    //     required
    //     type="email"
    //   />
    //   <div>
    //     {message
    //       ? message
    //       : ``}
    //   </div>
    //   <button type="submit">{'✨ Subscribe 💌'}</button>
    // </form>
    <>
    <form className="mt-4 sm:flex sm:max-w-md" onSubmit={subscribe}>
    <label htmlFor="email-address" className="sr-only">
      Email address
    </label>
    <input
        id="email-input"
        name="email"
        ref={inputEl}
        required
        type="email"
      autoComplete="email"
      className="appearance-none min-w-0 w-full bg-white border border-gray-100 border-2 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
      placeholder="Enter your email"
    />
    <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
      <button
        type="submit"
        className="w-full bg-red-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-0"
      >
        Subscribe
      </button>
    </div>
    
  </form>
  <div className="text-gray-200 mt-2">
  {message
        ? message
        : ``}
        </div>
        </>
  );
  
}