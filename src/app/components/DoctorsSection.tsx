import { motion } from "motion/react";
import { Star, Calendar, MessageSquare, Award } from "lucide-react";

const doctors = [
  {
    name: "Dr. Rajesh Sharma",
    specialty: "Cardiologist",
    dept: "Cardiology",
    exp: "18 years",
    rating: 4.9,
    reviews: 312,
    available: "Mon, Wed, Fri",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&auto=format",
    tags: ["Heart Failure", "Angioplasty", "ECG"],
    color: "#E63946",
  },
  {
    name: "Dr. Priya Mehta",
    specialty: "Neurologist",
    dept: "Neurology",
    exp: "14 years",
    rating: 4.8,
    reviews: 268,
    available: "Tue, Thu, Sat",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop&auto=format",
    tags: ["Stroke", "Epilepsy", "Migraine"],
    color: "#7C3AED",
  },
  {
    name: "Dr. Arun Kumar",
    specialty: "Orthopedic Surgeon",
    dept: "Orthopedics",
    exp: "22 years",
    rating: 4.9,
    reviews: 445,
    available: "Mon–Sat",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&auto=format",
    tags: ["Joint Replacement", "Sports Injury", "Spine"],
    color: "#F4A261",
  },
  {
    name: "Dr. Sunita Patel",
    specialty: "Gynaecologist",
    dept: "Obstetrics & Gynaecology",
    exp: "16 years",
    rating: 4.9,
    reviews: 521,
    available: "Mon, Wed, Fri",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&auto=format",
    tags: ["Maternity", "Laparoscopy", "PCOS"],
    color: "#DB2777",
  },
];

export function DoctorsSection() {
  return (
    <section id="doctors" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            OUR SPECIALISTS
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>Meet Our Expert Doctors</h2>
          <p style={{ color: "#6B7280", maxWidth: "500px", margin: "1rem auto 0", lineHeight: 1.75 }}>
            200+ specialists across 28 departments — all accessible online, with transparent
            availability and verified patient reviews.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative overflow-hidden" style={{ height: "220px" }}>
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />

                {/* Rating badge */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                >
                  <Star size={11} fill="#F4A261" color="#F4A261" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "white" }}>{doc.rating}</span>
                </div>

                {/* Department */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded-lg"
                    style={{ background: doc.color, fontSize: "0.72rem", fontWeight: 600, color: "white" }}
                  >
                    {doc.dept}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 style={{ color: "#1B2B3A", marginBottom: "0.15rem" }}>{doc.name}</h4>
                <p style={{ fontSize: "0.82rem", color: "#6B7280", marginBottom: "0.75rem" }}>
                  {doc.specialty} • {doc.exp} exp.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: "#F4F6F9", fontSize: "0.72rem", color: "#6B7280" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Award size={12} style={{ color: "#2A9D8F" }} />
                  <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Available: {doc.available}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: "#2A9D8F", fontSize: "0.82rem", fontWeight: 600 }}
                  >
                    <Calendar size={13} className="inline mr-1" /> Book
                  </button>
                  <button
                    className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-accent hover:text-white transition-all"
                    style={{ borderColor: "#4A9EDA", color: "#4A9EDA" }}
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#all-doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
            style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontWeight: 600 }}
          >
            View All 200+ Specialists
          </a>
        </div>
      </div>
    </section>
  );
}
