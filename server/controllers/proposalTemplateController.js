const ProposalTemplate = require('../models/ProposalTemplate');

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await ProposalTemplate.find({}, { content: 0 }); // Exclude content for listing
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const template = await ProposalTemplate.findOne({ id: req.params.id });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Failed to fetch template' });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { title, description, sections, content } = req.body;
    
    // Get the highest ID and increment
    const highestTemplate = await ProposalTemplate.findOne().sort('-id');
    const newId = highestTemplate ? highestTemplate.id + 1 : 1;
    
    const template = new ProposalTemplate({
      id: newId,
      title,
      description,
      sections,
      content
    });
    
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Failed to create template' });
  }
};

exports.seedTemplates = async (req, res) => {
  try {
    // Check if templates already exist
    const count = await ProposalTemplate.countDocuments();
    if (count > 0) {
      return res.status(200).json({ message: 'Templates already seeded' });
    }
    
    // Seed data with real content
    const templates = [
      {
        id: 1,
        title: 'Web Development',
        description: 'Complete website development proposal template',
        sections: ['Introduction', 'Scope', 'Timeline', 'Pricing'],
        content: `<h1>Web Development Proposal</h1>
        <h2>Introduction</h2>
        <p>Thank you for the opportunity to submit this proposal for the development of your website. Based on our discussions and understanding of your needs, we've crafted this comprehensive plan to deliver a high-quality web solution that meets your business objectives.</p>
        
        <h2>Scope of Work</h2>
        <p>We propose to design and develop a fully responsive website with the following components:</p>
        <ul>
          <li>Custom design aligned with your brand identity</li>
          <li>Homepage with dynamic content sections</li>
          <li>About page highlighting your company's story and team</li>
          <li>Services/Products pages with detailed information</li>
          <li>Contact form with validation and email notifications</li>
          <li>Blog section with content management capabilities</li>
          <li>Integration with your preferred analytics tools</li>
          <li>SEO optimization for better search engine visibility</li>
        </ul>
        
        <h2>Timeline</h2>
        <p>We estimate the project will take approximately 8-10 weeks to complete, broken down as follows:</p>
        <ul>
          <li><strong>Week 1-2:</strong> Discovery, planning, and wireframing</li>
          <li><strong>Week 3-4:</strong> Design concepts and revisions</li>
          <li><strong>Week 5-7:</strong> Frontend and backend development</li>
          <li><strong>Week 8:</strong> Content integration and testing</li>
          <li><strong>Week 9:</strong> Client review and feedback implementation</li>
          <li><strong>Week 10:</strong> Final testing, optimizations, and launch</li>
        </ul>
        
        <h2>Pricing</h2>
        <p>Our all-inclusive fee for this project is $X,XXX, which covers all the deliverables mentioned above. The payment schedule is as follows:</p>
        <ul>
          <li>50% deposit to commence work</li>
          <li>25% upon completion of design phase</li>
          <li>25% upon project completion and prior to website launch</li>
        </ul>
        
        <p>We look forward to partnering with {{company}} on this exciting project. Please don't hesitate to reach out if you have any questions or would like to discuss any aspect of this proposal in more detail.</p>
        
        <p>Prepared for: {{name}}<br>
        Project Deadline: {{deadline}}</p>`
      },
      {
        id: 2,
        title: 'Design Project',
        description: 'UI/UX design project proposal template',
        sections: ['Project Overview', 'Deliverables', 'Process', 'Investment'],
        content: `<h1>Design Project Proposal</h1>
        <h2>Project Overview</h2>
        <p>We're excited to present this proposal to {{company}} for your UI/UX design project. Having analyzed your requirements, we're confident we can create a user-centered design that will elevate your product's user experience while meeting your business goals.</p>
        
        <h2>Deliverables</h2>
        <p>Our comprehensive design package includes:</p>
        <ul>
          <li>User research and persona development</li>
          <li>Information architecture and user flow diagrams</li>
          <li>Wireframes for all key screens (mobile and desktop)</li>
          <li>High-fidelity mockups with your brand styling</li>
          <li>Interactive prototype for user testing</li>
          <li>Design system with reusable components</li>
          <li>Handoff assets and documentation for developers</li>
          <li>Post-implementation review and refinements</li>
        </ul>
        
        <h2>Design Process</h2>
        <p>Our proven design methodology follows these key phases:</p>
        <ol>
          <li><strong>Discovery:</strong> Understanding your users, business goals, and technical constraints</li>
          <li><strong>Define:</strong> Clarifying the problem space and establishing design priorities</li>
          <li><strong>Ideation:</strong> Exploring multiple design concepts and approaches</li>
          <li><strong>Prototyping:</strong> Creating interactive models of the proposed solutions</li>
          <li><strong>Testing:</strong> Validating designs with representative users</li>
          <li><strong>Refinement:</strong> Iterating based on feedback and testing insights</li>
          <li><strong>Documentation:</strong> Preparing comprehensive handoff materials</li>
        </ol>
        
        <h2>Investment</h2>
        <p>The investment for this design project is $X,XXX, covering all deliverables outlined above. Our payment structure is:</p>
        <ul>
          <li>40% upfront retainer</li>
          <li>30% upon delivery of wireframes and user flows</li>
          <li>30% upon project completion and delivery of all assets</li>
        </ul>
        
        <p>We're looking forward to creating an exceptional design experience for {{company}} that will delight your users and drive your business forward.</p>
        
        <p>Prepared for: {{name}}<br>
        Project Deadline: {{deadline}}</p>`
      },
      {
        id: 3,
        title: 'Marketing Campaign',
        description: 'Digital marketing campaign proposal template',
        sections: ['Strategy', 'Channels', 'Timeline', 'ROI Projection'],
        content: `<h1>Digital Marketing Campaign Proposal</h1>
        <h2>Strategy Overview</h2>
        <p>We're pleased to present this digital marketing campaign proposal to {{company}}. Based on our analysis of your market position and goals, we've developed a multi-channel strategy designed to increase your brand visibility, engage your target audience, and drive measurable conversions.</p>
        
        <h2>Channel Mix & Tactics</h2>
        <p>Our recommended channel strategy includes:</p>
        <ul>
          <li><strong>Search Engine Marketing:</strong> Targeted keyword campaigns to capture high-intent traffic</li>
          <li><strong>Social Media Advertising:</strong> Platform-specific campaigns on [platforms] targeting [demographics]</li>
          <li><strong>Content Marketing:</strong> Development and promotion of valuable content pieces</li>
          <li><strong>Email Marketing:</strong> Segmented campaigns to nurture leads and re-engage customers</li>
          <li><strong>Retargeting:</strong> Strategic pixel placement to recapture interested prospects</li>
          <li><strong>Influencer Partnerships:</strong> Collaborations with relevant industry voices</li>
        </ul>
        
        <h2>Campaign Timeline</h2>
        <p>We propose a 3-month campaign structure:</p>
        <ul>
          <li><strong>Month 1:</strong> Campaign setup, baseline establishment, and initial launch</li>
          <li><strong>Month 2:</strong> Performance analysis, optimization, and scaling successful tactics</li>
          <li><strong>Month 3:</strong> Refinement, expansion to secondary audiences, and long-term strategy development</li>
        </ul>
        
        <h2>ROI Projection</h2>
        <p>Based on industry benchmarks and our experience with similar campaigns, we project:</p>
        <ul>
          <li>Increase in qualified website traffic: 30-40%</li>
          <li>Improvement in conversion rate: 15-20%</li>
          <li>Growth in lead generation: 25-35%</li>
          <li>Estimated ROI: 3-4x your marketing investment</li>
        </ul>
        
        <p>The investment for this 3-month campaign is $X,XXX, which includes all strategy development, creative production, media spend, and comprehensive reporting.</p>
        
        <p>We're excited about the opportunity to drive significant results for {{company}} through this targeted marketing approach.</p>
        
        <p>Prepared for: {{name}}<br>
        Campaign Deadline: {{deadline}}</p>`
      }
    ];
    
    await ProposalTemplate.insertMany(templates);
    res.status(200).json({ message: 'Templates seeded successfully' });
  } catch (error) {
    console.error('Error seeding templates:', error);
    res.status(500).json({ message: 'Failed to seed templates' });
  }
};
  

exports.deleteTemplate = async (req, res) => {
    try {
    const template = await ProposalTemplate.findOneAndDelete({ id: req.params.id });
    if (!template) {
        return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Failed to delete template' });
    }
};