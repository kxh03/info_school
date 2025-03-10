
import FeaturedPosts from "@/components/home/FeaturedPosts";

export default function Index() {
  return (
    <div className="page-transition">
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Connect with your University Community
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Share ideas, stay informed, and engage with fellow students and faculty through university club blogs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <a href="/register" className="inline-flex items-center justify-center h-10 px-6 py-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Join Now
            </a>
            <a href="/explore" className="inline-flex items-center justify-center h-10 px-6 py-6 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              Explore Content
            </a>
          </div>
        </div>
      </section>
      
      <FeaturedPosts />
      
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg hover-scale">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Peers</h3>
              <p className="text-muted-foreground">
                Find and connect with students who share your interests through university clubs and organizations.
              </p>
            </div>
            
            <div className="p-6 rounded-lg hover-scale">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-square"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Ideas</h3>
              <p className="text-muted-foreground">
                Create engaging content with our modern editor and share your perspectives with the community.
              </p>
            </div>
            
            <div className="p-6 rounded-lg hover-scale">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
              <p className="text-muted-foreground">
                Get notified about the latest posts, comments, and activities from your favorite clubs and people.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Join the University Community</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground mb-8">
              Campus Connections is the platform where university communities come together to share knowledge,
              discuss ideas, and stay connected. Whether you're a student, faculty member, or alumnus,
              there's a place for you here.
            </p>
            <a href="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Create Your Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
