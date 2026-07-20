"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simulate send since we don't have a contact API yet
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2">
          Contact <span className="gold-text">Us</span>
        </h1>
        <p className="text-[#666] text-lg mb-12">
          Have a question, suggestion, or need to report an issue? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-[#666]">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
                    <Button
                      variant="outline"
                      className="mt-6 border-[#333] hover:border-[#D4A843]/30"
                      onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#222] text-white text-sm focus:outline-none focus:border-[#D4A843]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#222] text-white text-sm focus:outline-none focus:border-[#D4A843]/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#222] text-white text-sm focus:outline-none focus:border-[#D4A843]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#222] text-white text-sm focus:outline-none focus:border-[#D4A843]/50 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sending}
                      className="bg-[#D4A843] hover:bg-[#b8922e] text-black font-semibold"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <Mail className="h-5 w-5 text-[#D4A843] mb-2" />
                <h3 className="font-medium text-sm mb-1">Email</h3>
                <p className="text-xs text-[#666]">support@umawall.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <MessageSquare className="h-5 w-5 text-[#D4A843] mb-2" />
                <h3 className="font-medium text-sm mb-1">Community</h3>
                <p className="text-xs text-[#666]">Join our Discord for quick help and discussions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
