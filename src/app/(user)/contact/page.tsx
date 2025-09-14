import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail className="w-5 h-5" />, title: "Email", info: "support@expensetracker.com" },
                  { icon: <Phone className="w-5 h-5" />, title: "Phone", info: "+1 (555) 123-4567" },
                  { icon: <MapPin className="w-5 h-5" />, title: "Address", info: "123 Tech Street, San Francisco, CA 94105" },
                  { icon: <Clock className="w-5 h-5" />, title: "Hours", info: "Mon-Fri 9AM-6PM PST" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-400 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Your message..." rows={5} />
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}