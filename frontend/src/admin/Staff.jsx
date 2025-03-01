import React from 'react'

const Staff = () => {
  return (
    <>
     {/* <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 border rounded-lg outline-none focus:ring-0"
      >
        <option value="user" className="p-2">I am a Patient</option>
        <option value="admin" className="p-2">I am a Staff</option>
      </select> */}
      <input
        onChange={handleChange}
        type="email"
        name="email"
        placeholder="What's your username?"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        onChange={handleChange}
        type="password"
        name="password"
        placeholder="And what about password?"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-10 py-3 bg-green-50 text-green-900 rounded-lg shadow-[5px_5px_0px_rgba(34,197,94,1)]"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    {/* </form> */}
    </>
  )
}

export default Staff