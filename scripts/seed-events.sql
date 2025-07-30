-- Insert sample events for March 2025
INSERT INTO events (title, description, start_time, end_time, date, location, color, organizer, attendees) VALUES
-- Week 1 (March 2-8, 2025)
('Team Meeting', 'Weekly team sync-up', '09:00', '10:00', '2025-03-03', 'Conference Room A', 'bg-blue-500', 'Alice Brown', ARRAY['John Doe', 'Jane Smith', 'Bob Johnson']),
('Lunch with Sarah', 'Discuss project timeline', '12:30', '13:30', '2025-03-03', 'Cafe Nero', 'bg-green-500', 'You', ARRAY['Sarah Lee']),
('Product Planning', 'Roadmap discussion for Q3', '14:00', '15:30', '2025-03-03', 'Strategy Room', 'bg-pink-400', 'Product Manager', ARRAY['Product Team', 'Engineering Leads']),

('Morning Standup', 'Daily team standup', '08:30', '09:30', '2025-03-04', 'Slack Huddle', 'bg-blue-400', 'Scrum Master', ARRAY['Development Team']),
('Client Call', 'Quarterly review with major client', '10:00', '11:00', '2025-03-04', 'Zoom Meeting', 'bg-yellow-500', 'Account Manager', ARRAY['Client Team', 'Sales Team']),

('Project Review', 'Q2 project progress review', '14:00', '15:30', '2025-03-05', 'Meeting Room 3', 'bg-purple-500', 'Project Manager', ARRAY['Team Alpha', 'Stakeholders']),
('Budget Review', 'Quarterly budget analysis', '13:30', '15:00', '2025-03-05', 'Finance Office', 'bg-yellow-400', 'CFO', ARRAY['Finance Team', 'Department Heads']),

('Team Training', 'New tool onboarding session', '09:30', '11:30', '2025-03-06', 'Training Room', 'bg-green-400', 'HR', ARRAY['All Departments']),
('Team Brainstorm', 'Ideation session for new product features', '13:00', '14:30', '2025-03-06', 'Creative Space', 'bg-indigo-500', 'Product Owner', ARRAY['Product Team', 'Design Team']),

('Product Demo', 'Showcase new features to stakeholders', '11:00', '12:00', '2025-03-07', 'Demo Room', 'bg-pink-500', 'Tech Lead', ARRAY['Stakeholders', 'Dev Team']),
('Design Review', 'Review new UI designs', '14:30', '15:45', '2025-03-07', 'Design Lab', 'bg-purple-400', 'Lead Designer', ARRAY['UX Team', 'Product Manager']),

('Marketing Meeting', 'Discuss Q3 marketing strategy', '13:00', '14:00', '2025-03-08', 'Marketing Office', 'bg-teal-500', 'Marketing Director', ARRAY['Marketing Team']),
('Client Presentation', 'Present new project proposal', '11:00', '12:30', '2025-03-08', 'Client Office', 'bg-orange-400', 'Account Executive', ARRAY['Sales Team', 'Client Representatives']),

-- Week 2 (March 9-15, 2025)
('Weekly Planning', 'Plan upcoming sprint', '09:00', '10:30', '2025-03-10', 'Conference Room B', 'bg-blue-600', 'Scrum Master', ARRAY['Development Team']),
('Vendor Meeting', 'Discuss new partnerships', '14:00', '15:00', '2025-03-11', 'Meeting Room 1', 'bg-green-600', 'Business Development', ARRAY['Vendor Representatives']),
('Code Review Session', 'Review recent pull requests', '10:00', '11:30', '2025-03-12', 'Dev Area', 'bg-purple-600', 'Senior Developer', ARRAY['Dev Team']),
('Customer Feedback Review', 'Analyze recent user feedback', '13:00', '14:30', '2025-03-13', 'Product Office', 'bg-orange-500', 'Product Manager', ARRAY['UX Team', 'Customer Success']),
('All Hands Meeting', 'Company-wide updates', '15:00', '16:00', '2025-03-14', 'Main Auditorium', 'bg-red-500', 'CEO', ARRAY['All Employees']),

-- Week 3 (March 16-22, 2025)
('Security Review', 'Quarterly security assessment', '09:00', '11:00', '2025-03-17', 'Security Office', 'bg-red-600', 'Security Lead', ARRAY['IT Team', 'Compliance']),
('Performance Review', 'Individual performance discussions', '14:00', '15:00', '2025-03-18', 'HR Office', 'bg-yellow-600', 'HR Manager', ARRAY['Team Leads']),
('Innovation Workshop', 'Brainstorm new product ideas', '10:00', '12:00', '2025-03-19', 'Innovation Lab', 'bg-purple-700', 'Innovation Lead', ARRAY['Cross-functional Team']),
('Board Meeting', 'Monthly board review', '13:00', '15:00', '2025-03-20', 'Board Room', 'bg-gray-600', 'CEO', ARRAY['Board Members', 'Executive Team']),
('Team Building', 'Quarterly team building event', '14:00', '17:00', '2025-03-21', 'Offsite Location', 'bg-green-700', 'HR', ARRAY['All Teams']),

-- Week 4 (March 23-29, 2025)
('Sprint Planning', 'Plan next development sprint', '09:00', '11:00', '2025-03-24', 'Conference Room A', 'bg-blue-700', 'Product Owner', ARRAY['Development Team']),
('Customer Demo', 'Demo new features to key customers', '14:00', '15:30', '2025-03-25', 'Demo Room', 'bg-green-800', 'Sales Team', ARRAY['Key Customers']),
('Architecture Review', 'Review system architecture changes', '10:00', '12:00', '2025-03-26', 'Tech Office', 'bg-purple-800', 'Tech Lead', ARRAY['Senior Developers', 'Architects']),
('Marketing Campaign Review', 'Review Q2 marketing campaigns', '13:00', '14:30', '2025-03-27', 'Marketing Office', 'bg-orange-600', 'Marketing Director', ARRAY['Marketing Team', 'Creative Team']),
('Month End Review', 'Review monthly metrics and goals', '15:00', '16:30', '2025-03-28', 'Executive Conference Room', 'bg-indigo-700', 'COO', ARRAY['Department Heads']);
