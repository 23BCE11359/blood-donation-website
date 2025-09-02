function AboutUs() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-red-600 mb-6">About Us</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
        <p className="text-gray-600">
          At Blood Donation Hub, our mission is to bridge the gap between blood donors and those in need. We aim to save lives by facilitating safe, voluntary blood donations and raising awareness about the importance of regular donations. Every contribution helps us build a healthier community.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Team</h2>
        <p className="text-gray-600">
          Our dedicated team includes medical professionals, volunteers, and tech enthusiasts working together to make blood donation accessible. Meet our leaders:
          <ul className="list-disc list-inside mt-2">
            <li>"TBD" - Medical Director</li>
            <li>"TBD" - Volunteer Coordinator</li>
            <li>Naman Dhakad - Tech Lead</li>
          </ul>
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
        <p className="text-gray-600">
          Have questions? Reach out to us at:
          <ul className="list-disc list-inside mt-2">
            <li>Email: naman.23bce11359@vitbhopal.ac.in</li>
            <li>Phone: +91-9425629492</li>
            <li>Address: VIT Bhopal University, Kothrikalan, Sehore, Madhya Pradesh - 466114, INDIA</li>
          </ul>
        </p>
      </section>
    </div>
  );
}

export default AboutUs;