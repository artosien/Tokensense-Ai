"use client";

import React, { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserCircle, Briefcase, Globe, Save } from "lucide-react";

interface UserBio {
    role: string;
    company: string;
    location: string;
    bio: string;
}

interface BioUpdateModalProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function BioUpdateModal({ userId, isOpen, onClose }: BioUpdateModalProps) {
    const [formData, setFormData] = useState<UserBio>({
        role: "",
        company: "",
        location: "",
        bio: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Load bio from localStorage on open
    useEffect(() => {
        if (isOpen && userId) {
            const savedBio = localStorage.getItem(`user_bio_${userId}`);
            if (savedBio) {
                try {
                    setFormData(JSON.parse(savedBio));
                } catch (e) {
                    console.error("Failed to parse saved bio", e);
                }
            }
        }
    }, [isOpen, userId]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate a small delay
        setTimeout(() => {
            localStorage.setItem(`user_bio_${userId}`, JSON.stringify(formData));
            setIsSaving(false);
            onClose();
            // Trigger a storage event for other components (like account page) to update
            window.dispatchEvent(new Event('storage'));
        }, 600);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-border/40 bg-card/95 backdrop-blur-2xl">
                <DialogHeader>
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                        <UserCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Update Your Profile</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Add details about yourself to personalize your experience.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Your Role
                            </Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="role"
                                    placeholder="e.g. Senior Developer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="pl-10 bg-background/50 border-border/40 focus:border-indigo-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Company
                            </Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="company"
                                    placeholder="e.g. Tech Corp"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="pl-10 bg-background/50 border-border/40 focus:border-indigo-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Location
                        </Label>
                        <Input
                            id="location"
                            placeholder="e.g. San Francisco, CA"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-background/50 border-border/40 focus:border-indigo-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Short Bio
                        </Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us a bit about your work with AI..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="min-h-[100px] bg-background/50 border-border/40 focus:border-indigo-500/50 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t border-border/40">
                    <Button variant="ghost" onClick={onClose} className="hover:bg-muted/50">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 px-6 shadow-lg shadow-indigo-500/20"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
