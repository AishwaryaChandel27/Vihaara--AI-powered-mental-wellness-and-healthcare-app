import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <Card className="w-full my-8">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
          <i className={`${icon} text-3xl`}></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
