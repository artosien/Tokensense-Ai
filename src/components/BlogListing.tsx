"use client";

import React, { useState, useMemo } from 'react';
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { BlogPost } from "@/lib/blog-service";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogListingProps {
  initialPosts: BlogPost[];
}

type SortOption = 'newest' | 'oldest' | 'read-time-asc' | 'read-time-desc';

export default function BlogListing({ initialPosts }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const categories = useMemo(() => {
    const cats = new Set(initialPosts.map(post => post.category));
    return Array.from(cats).sort();
  }, [initialPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...initialPosts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.description.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'oldest':
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case 'read-time-asc':
          return parseInt(a.readTime) - parseInt(b.readTime);
        case 'read-time-desc':
          return parseInt(b.readTime) - parseInt(a.readTime);
        default:
          return 0;
      }
    });

    return result;
  }, [initialPosts, selectedCategory, searchQuery, sortBy]);

  const sortLabel = {
    'newest': 'Newest First',
    'oldest': 'Oldest First',
    'read-time-asc': 'Shortest Read',
    'read-time-desc': 'Longest Read'
  }[sortBy];

  return (
    <div className="space-y-10">
      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-8 border-b border-border/40">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            className="pl-10 bg-card/50 border-border/40 focus:border-indigo-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <Button 
              variant={selectedCategory === null ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full text-xs h-8"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                size="sm"
                className="rounded-full text-xs h-8 whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="h-6 w-px bg-border/40 hidden md:block mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-full text-xs gap-2 border-border/40 bg-card/50">
                <SlidersHorizontal className="w-3 h-3" />
                Sort: {sortLabel}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border/40 backdrop-blur-xl">
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => setSortBy('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => setSortBy('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => setSortBy('read-time-asc')}>
                Shortest Read
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => setSortBy('read-time-desc')}>
                Longest Read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground">{filteredAndSortedPosts.length}</span> articles
          {selectedCategory && <span> in <span className="text-indigo-400 font-bold">{selectedCategory}</span></span>}
          {searchQuery && <span> matching "<span className="text-indigo-400 font-bold">{searchQuery}</span>"</span>}
        </p>
        
        {(selectedCategory || searchQuery) && (
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs text-muted-foreground hover:text-indigo-400 h-auto p-0"
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Blog Grid */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAndSortedPosts.map((post) => (
            <Card key={post.id} className="group border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold text-indigo-400 uppercase tracking-wider border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold group-hover:text-indigo-400 transition-colors leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" className="p-0 text-indigo-400 hover:text-indigo-300 hover:bg-transparent group/btn" asChild>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                    Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 rounded-3xl border border-dashed border-border/40 bg-card/20">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-indigo-400 opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No articles found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm">
            We couldn't find any articles matching your current search or filter criteria.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
          >
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
}
