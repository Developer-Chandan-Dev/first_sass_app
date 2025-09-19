'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Upgraded to Pro',
    time: '2 minutes ago',
    type: 'upgrade',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'New user registered',
    time: '5 minutes ago',
    type: 'signup',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'Cancelled subscription',
    time: '1 hour ago',
    type: 'cancel',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    action: 'Added 50 expenses',
    time: '2 hours ago',
    type: 'activity',
  },
];

export function RecentActivity() {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upgrade': return 'bg-green-100 text-green-800';
      case 'signup': return 'bg-blue-100 text-blue-800';
      case 'cancel': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarFallback className="text-xs">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {activity.user}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.action}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1 py-0 h-4 ${getActivityColor(activity.type)}`}
                >
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}