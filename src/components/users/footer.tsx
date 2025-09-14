import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ExpenseTracker
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              The future of expense management. Track, analyze, and optimize your finances with AI-powered insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <Link href="#features" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Dashboard
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                API
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="#about" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                About
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Blog
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Careers
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:support@expensetracker.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">support@expensetracker.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 ExpenseTracker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}