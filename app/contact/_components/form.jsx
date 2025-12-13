import React from 'react'

const Form = () => {
  return (
    <div className='border p-10 w-100 sm:w-200 rounded-md bg-zinc-900 shadow-md'>
        <form className="flex flex-col gap-4 font-sans text-white">
            <label className="flex flex-col">
                Name
                <input type="text" name="name" className="border border-gray-300 p-2 rounded" />
            </label>
            <label className="flex flex-col">
                Email
                <input type="email" name="email" className="border border-gray-300 p-2 rounded" />
            </label>
            <label className="flex flex-col">
                Your Message
                <textarea name="message" className="border border-gray-300 p-2 rounded" rows="10" placeholder='share your thoughts with us'></textarea>
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Submit</button>
        </form>
    </div>
  )
}

export default Form