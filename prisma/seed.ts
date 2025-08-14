import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Organizations
  const techCorp = await prisma.organization.create({
    data: {
      name: 'TechCorp Solutions',
      type: 'Technology',
      region: 'North America',
    },
  })

  const healthPlus = await prisma.organization.create({
    data: {
      name: 'HealthPlus Medical',
      type: 'Healthcare',
      region: 'Europe',
    },
  })

  const globalConsulting = await prisma.organization.create({
    data: {
      name: 'Global Consulting Group',
      type: 'Consulting',
      region: 'Asia Pacific',
    },
  })

  console.log('✅ Created organizations')

  // Create People
  const john = await prisma.person.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0123',
      tags: ['lead', 'enterprise', 'decision-maker'],
      customFields: {
        company: 'TechCorp Solutions',
        budget: 50000,
        preferredContact: 'email'
      },
      ownerUserId: 'user_1',
    },
  })

  const sarah = await prisma.person.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@healthplus.com',
      phone: '+44-20-7946-0958',
      tags: ['prospect', 'healthcare', 'technical'],
      customFields: {
        department: 'IT',
        role: 'CTO',
        meetingScheduled: true
      },
      ownerUserId: 'user_1',
    },
  })

  const mike = await prisma.person.create({
    data: {
      name: 'Mike Chen',
      email: 'mike.chen@globalconsulting.com',
      phone: '+65-6123-4567',
      tags: ['client', 'consulting', 'partnership'],
      customFields: {
        projectType: 'Digital Transformation',
        timeline: '6 months',
        status: 'active'
      },
      ownerUserId: 'user_2',
    },
  })

  const anna = await prisma.person.create({
    data: {
      name: 'Anna Rodriguez',
      email: 'anna.rodriguez@example.com',
      phone: '+1-555-0456',
      tags: ['lead', 'startup'],
      customFields: {
        industry: 'Fintech',
        employees: 25,
        funding: 'Series A'
      },
      ownerUserId: 'user_1',
    },
  })

  console.log('✅ Created people')

  // Create Person-Organization relationships
  await prisma.personOrganization.create({
    data: {
      personId: john.id,
      orgId: techCorp.id,
      role: 'Chief Technology Officer',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: sarah.id,
      orgId: healthPlus.id,
      role: 'VP of Engineering',
    },
  })

  await prisma.personOrganization.create({
    data: {
      personId: mike.id,
      orgId: globalConsulting.id,
      role: 'Senior Partner',
    },
  })

  console.log('✅ Created person-organization relationships')

  // Create Sales Pipeline
  const salesPipeline = await prisma.pipeline.create({
    data: {
      name: 'Sales Pipeline',
    },
  })

  console.log('✅ Created pipeline')

  // Create Pipeline Stages
  const prospectingStage = await prisma.stage.create({
    data: {
      pipelineId: salesPipeline.id,
      name: 'Prospecting',
      order: 1,
    },
  })

  const qualificationStage = await prisma.stage.create({
    data: {
      pipelineId: salesPipeline.id,
      name: 'Qualification',
      order: 2,
    },
  })

  const proposalStage = await prisma.stage.create({
    data: {
      pipelineId: salesPipeline.id,
      name: 'Proposal',
      order: 3,
    },
  })

  const negotiationStage = await prisma.stage.create({
    data: {
      pipelineId: salesPipeline.id,
      name: 'Negotiation',
      order: 4,
    },
  })

  const closedWonStage = await prisma.stage.create({
    data: {
      pipelineId: salesPipeline.id,
      name: 'Closed Won',
      order: 5,
    },
  })

  console.log('✅ Created pipeline stages')

  // Create Pipeline Items
  await prisma.pipelineItem.create({
    data: {
      title: 'Enterprise Software Implementation',
      personId: john.id,
      organizationId: techCorp.id,
      ownerUserId: 'user_1',
      stageId: proposalStage.id,
    },
  })

  await prisma.pipelineItem.create({
    data: {
      title: 'Healthcare Management System',
      personId: sarah.id,
      organizationId: healthPlus.id,
      ownerUserId: 'user_1',
      stageId: qualificationStage.id,
    },
  })

  await prisma.pipelineItem.create({
    data: {
      title: 'Digital Transformation Consulting',
      personId: mike.id,
      organizationId: globalConsulting.id,
      ownerUserId: 'user_2',
      stageId: negotiationStage.id,
    },
  })

  await prisma.pipelineItem.create({
    data: {
      title: 'Fintech Platform Development',
      personId: anna.id,
      organizationId: null, // No organization associated
      ownerUserId: 'user_1',
      stageId: prospectingStage.id,
    },
  })

  await prisma.pipelineItem.create({
    data: {
      title: 'Security Audit Services',
      personId: null, // No specific person yet
      organizationId: techCorp.id,
      ownerUserId: 'user_2',
      stageId: prospectingStage.id,
    },
  })

  await prisma.pipelineItem.create({
    data: {
      title: 'Cloud Migration Project',
      personId: null,
      organizationId: null, // Neither person nor org specified
      ownerUserId: 'user_1',
      stageId: closedWonStage.id,
    },
  })

  console.log('✅ Created pipeline items')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
