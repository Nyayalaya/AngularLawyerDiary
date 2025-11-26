import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface StatCard {
  title: string;
  value: string;
  icon: string;
  trend: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
stats: StatCard[] = [
    {
      title: 'Total Cases',
      value: '1,248',
      icon: 'description',
      trend: '+12%',
      colorClass: 'purple'
    },
    {
      title: 'Active Clients',
      value: '856',
      icon: 'people',
      trend: '+8%',
      colorClass: 'blue'
    },
    {
      title: 'Lawyers',
      value: '42',
      icon: 'work',
      trend: '+3%',
      colorClass: 'green'
    },
    {
      title: 'Pending Work',
      value: '124',
      icon: 'pending_actions',
      trend: '-5%',
      colorClass: 'orange'
    }
  ];

  recentActivities = [
    {
      action: 'New case filed',
      client: 'Sarah Johnson',
      time: '2 hours ago'
    },
    {
      action: 'Court hearing scheduled',
      client: 'Michael Brown',
      time: '5 hours ago'
    },
    {
      action: 'Document uploaded',
      client: 'Emma Wilson',
      time: '1 day ago'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
