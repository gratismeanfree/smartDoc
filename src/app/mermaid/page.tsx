import React from 'react'

import Mermaid from '../components/Mermaid'

function page() {
    
  const mindmap = `
flowchart LR

    %% =====================
    %% NODES
    %% =====================

    QMP[Quality Management Presentation]:::main

    QMP --> RP[Reporting Period]:::main

    QMP --> PS1[Product / Service 1]:::product
    PS1 --> CS1[Current Status]:::orange
    CS1 --> QI1_1[Quality Indicator]:::leaf
    CS1 --> QI1_2[Quality Indicator]:::leaf
    CS1 --> QI1_3[Quality Indicator]:::leaf

    PS1 --> QD1[Quality Dynamics]:::orange

    PS1 --> DC1[Defect Correction]:::orange
    DC1 --> D1_1[Defect]:::leaf
    D1_1 --> RC1_1[Root Cause]:::light
    RC1_1 --> CA1_1[Corrective Action]:::light

    DC1 --> D1_2[Defect]:::leaf
    D1_2 --> RC1_2[Root Cause]:::light
    RC1_2 --> CA1_2[Corrective Action]:::light

    DC1 --> D1_3[Defect]:::leaf

    QMP --> PS2[Product / Service 2]:::product
    PS2 --> CS2[Current Status]:::orange
    PS2 --> QD2[Quality Dynamics]:::orange
    PS2 --> DC2[Defect Correction]:::orange

    QMP --> PS3[Product / Service 3]:::product
    PS3 --> CS3[Current Status]:::orange
    PS3 --> QD3[Quality Dynamics]:::orange
    PS3 --> DC3[Defect Correction]:::orange

    %% =====================
    %% STYLES
    %% =====================

    classDef main fill:#2c3e5a,stroke:#1f2a40,color:#ffffff,stroke-width:1px;
    classDef product fill:#355a8c,stroke:#1c355a,color:#ffffff,stroke-width:1px;
    classDef orange fill:#e67e22,stroke:#d35400,color:#ffffff,stroke-width:1px;
    classDef leaf fill:#f39c12,stroke:#e67e22,color:#ffffff,stroke-width:1px;
    classDef light fill:#f7c884,stroke:#e67e22,color:#000000,stroke-width:1px;
`;


const mindmap3=`
mindmap
  root((5 Signs Your Project is Going Wrong))
    Time_&_Budget_Issues
      Missed_Deadlines
        Unrealistic_Scheduling
          Insufficient_Time_Allocation
          Overly_Optimistic_Estimates
        Poor_Task_Prioritization
          Lack_of_Prioritization_Matrix
          Focus_on_Less_Important_Tasks
        Lack_of_Resource_Allocation
          Insufficient_Personnel
          Inadequate_Tools_&_Equipment
    Communication_&_Morale
      Scope_Creep
        Poorly_Defined_Requirements
          Ambiguous_Specifications
          Lack_of_User_Input
        Lack_of_Change_Management
          No_Change_Control_Process
          Uncontrolled_Changes
        Uncontrolled_Additions
          Adding_Features_without_Approval
          Ignoring_Impact_Assessments
      Low_Team_Morale
        Lack_of_Recognition
          Insufficient_Appreciation
          No_Rewards_for_Achievements
        High_Stress_Levels
          Overwork
          Pressure_to_Meet_Deadlines
        Conflict_within_the_Team
          Personality_Clashes
          Lack_of_Collaboration
    Budget_Overruns
      Unforeseen_Expenses
        Unexpected_Costs
        Changes_in_Material_Prices
      Inefficient_Resource_Use
        Waste_of_Materials
        Overtime_Costs
      Lack_of_Cost_Control
        Poor_Budget_Tracking
        Insufficient_Cost_Monitoring
    Communication_Breakdown
      Lack_of_Transparency
        Poor_Information_Sharing
        Hidden_Problems
      Ineffective_Meetings
        Unclear_Agendas
        Lack_of_Action_Items
      Poor_Feedback_Mechanisms
        Limited_Feedback_Opportunities
        Ignoring_Feedback
`
const mindmap4=`
graph TD
  %% NETWORK STYLE (non-hierarchical, curved)
  
  style QMP fill:#2c3e5a,stroke:#1f2a40,color:#fff,stroke-width:1px
  style PS1 fill:#355a8c,stroke:#1c355a,color:#fff,stroke-width:1px
  style PS2 fill:#355a8c,stroke:#1c355a,color:#fff,stroke-width:1px
  style PS3 fill:#355a8c,stroke:#1c355a,color:#fff,stroke-width:1px
  style QI1 fill:#f39c12,stroke:#e67e22,color:#fff,stroke-width:1px
  style QI2 fill:#f39c12,stroke:#e67e22,color:#fff,stroke-width:1px
  style QI3 fill:#f39c12,stroke:#e67e22,color:#fff,stroke-width:1px
  
  QMP[Quality Management Presentation]
  
  PS1[Product / Service 1]
  PS2[Product / Service 2]
  PS3[Product / Service 3]
  
  QI1[Quality Indicator 1]
  QI2[Quality Indicator 2]
  QI3[Quality Indicator 3]
  
  %% Connections
  QMP --- PS1
  QMP --- PS2
  QMP --- PS3
  
  PS1 --- QI1
  PS2 --- QI2
  PS3 --- QI3
`
const mindmap5=`timeline
    title Quality Management Process Timeline
    2023-01-01 : Start reporting period
    2023-01-10 : Collect product status data
    2023-01-20 : Analyze quality indicators
    2023-01-25 : Identify defects
    2023-02-01 : Implement corrective actions
    2023-02-15 : Review and finalize report
`

const mindmap7=`classDiagram
  class QualityManagementPresentation {
    +string reportingPeriod
    +list products
  }

  class Product {
    +string name
    +list qualityIndicators
    +list defects
  }

  class QualityIndicator {
    +string name
    +float value
  }

  class Defect {
    +string description
    +string rootCause
    +string correctiveAction
  }

  QualityManagementPresentation "1" -- "many" Product : contains
  Product "1" -- "many" QualityIndicator : has
  Product "1" -- "many" Defect : has
`
  return (
    <div>
      <h1>Mind map:</h1>
      <div className='origin-top-left scale-[0.45]'>
        <p>Mermaid4</p>
        <Mermaid chart={mindmap4}
       />
        <p>Mermaid5</p>
        <Mermaid chart={mindmap5}
       />
        
       
        <p>Mermaid7</p>
        <Mermaid chart={mindmap7}
       />
      </div>
      
    </div>
  )
}

export default page



