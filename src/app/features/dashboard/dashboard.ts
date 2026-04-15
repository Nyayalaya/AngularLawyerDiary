import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../auth/facade/auth.facade';
import { AuthUser } from '../../core';
import { Observable } from 'rxjs';
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
  userName = 'Admin';
  greeting = '';
  user$!: Observable<AuthUser | null>; // will be set in constructor
  quickActions = [
    { label: 'New Case', icon: 'add_circle', route: '/new-case' },
    { label: 'Clients', icon: 'people', route: '/clients' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' }
  ];

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

  constructor(private authFacade: AuthFacade) {
    this.user$ = this.authFacade.user$;
  }

  ngOnInit(): void {
    // set greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }

    // update name when user logs in
    this.authFacade.user$.subscribe((u: AuthUser | null) => {
      console.log('Dashboard received user from store', u);
      this.userName = u ? u.name : 'Admin';
    });
  }
}
