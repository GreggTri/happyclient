import React from 'react'

function ContactUsForm() {

    
  return (
    <div className="w-full lg:w-1/2">
        <form className="space-y-6">
        <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
            />
        </div>

        <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
            />
        </div>

        <div>
            <label htmlFor="company" className="sr-only">Company Name</label>
            <input
            id="company"
            name="company"
            type="text"
            placeholder="Company"
            className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
            />
        </div>

        <div>
            <label htmlFor="subject" className="sr-only">Subject</label>
            <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Subject"
            className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
            />
        </div>

        <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
            id="message"
            name="message"
            placeholder="Message"
            rows={4}
            className="w-full p-3 border border-WHITE bg-background text-text rounded-md focus:outline-none focus:border-primary"
            ></textarea>
        </div>

        <div className="text-right">
            <button type="submit" className="px-6 py-3 bg-primary text-background font-bold rounded-md hover:bg-opacity-90 focus:outline-none">
            Send Message
            </button>
        </div>
        </form>
    </div>
  )
}

export default ContactUsForm