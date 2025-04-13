
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { currentUser, userData, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
      console.error(error);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading profile...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback className="bg-anime-primary text-white text-2xl">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
                <p className="text-gray-400">{currentUser.email}</p>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="outline" className="border-anime-primary text-anime-primary">
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="activity">
            <TabsList className="w-full bg-gray-900 border-b border-gray-800">
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>Your recent activity on AnimeHub</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <p className="text-gray-400">
                      Your activity history will appear here. Start watching anime to see your activity.
                    </p>
                    <Button 
                      className="mt-4 bg-anime-primary hover:bg-anime-secondary"
                      onClick={() => navigate('/browse')}
                    >
                      Browse Anime
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                      <p className="text-gray-400 mb-4">Manage which emails you want to receive</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="new-episodes" className="mr-2" />
                          <label htmlFor="new-episodes">New episode alerts</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="new-comments" className="mr-2" />
                          <label htmlFor="new-comments">Comment replies</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="recommendations" className="mr-2" />
                          <label htmlFor="recommendations">Anime recommendations</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                      <p className="text-gray-400 mb-4">Control your privacy settings</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="public-profile" className="mr-2" />
                          <label htmlFor="public-profile">Make my profile public</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="public-watchlist" className="mr-2" />
                          <label htmlFor="public-watchlist">Make my watchlist public</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="public-comments" className="mr-2" />
                          <label htmlFor="public-comments">Show my comments to everyone</label>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="bg-anime-primary hover:bg-anime-secondary">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
