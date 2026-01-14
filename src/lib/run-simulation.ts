import { 
  DojoRun, 
  DojoEvent, 
  RUN_STEPS, 
  getDemoRuns, 
  saveDemoRuns,
  getDemoEvents,
  saveDemoEvents,
  getDemoChecks,
  generateReportMarkdown
} from './demo-data';

type RunUpdateCallback = (run: DojoRun) => void;
type EventCallback = (event: DojoEvent) => void;

let activeSimulation: ReturnType<typeof setTimeout> | null = null;

export function startRunSimulation(
  runId: string,
  onRunUpdate: RunUpdateCallback,
  onEvent: EventCallback
) {
  const runs = getDemoRuns();
  const runIndex = runs.findIndex(r => r.id === runId);
  if (runIndex === -1) return;

  const run = runs[runIndex];
  run.status = 'running';
  run.started_at = new Date().toISOString();
  run.current_step = 1;
  saveDemoRuns(runs);
  onRunUpdate({ ...run });

  let currentStep = 0;
  
  const processStep = () => {
    if (currentStep >= RUN_STEPS.length) return;
    
    const step = RUN_STEPS[currentStep];
    const updatedRuns = getDemoRuns();
    const updatedRun = updatedRuns.find(r => r.id === runId);
    if (!updatedRun) return;
    
    // Add event
    const event: DojoEvent = {
      id: `event-${Date.now()}-${step.step}`,
      run_id: runId,
      ts: new Date().toISOString(),
      level: 'info',
      step: step.step,
      message: `${step.name}...`
    };
    
    const events = getDemoEvents();
    events.push(event);
    saveDemoEvents(events);
    onEvent(event);
    
    // Update run
    updatedRun.current_step = step.step;
    
    // Special handling for step 7 (Opening PR) - add URLs
    if (step.step === 7) {
      updatedRun.pr_url = 'https://github.com/shipdojo/demo-vibecoded-app/pull/42';
      updatedRun.ci_url = 'https://github.com/shipdojo/demo-vibecoded-app/actions/runs/123456';
    }
    
    // Special handling for step 8 (Awaiting approval) - pause simulation
    if (step.step === 8) {
      updatedRun.status = 'awaiting_approval';
      saveDemoRuns(updatedRuns);
      onRunUpdate({ ...updatedRun });
      
      // Add waiting event
      const waitEvent: DojoEvent = {
        id: `event-${Date.now()}-wait`,
        run_id: runId,
        ts: new Date().toISOString(),
        level: 'warn',
        step: 8,
        message: 'Waiting for Dojo Gate approval...'
      };
      events.push(waitEvent);
      saveDemoEvents(events);
      onEvent(waitEvent);
      return; // Stop simulation here
    }
    
    saveDemoRuns(updatedRuns);
    onRunUpdate({ ...updatedRun });
    
    currentStep++;
    
    if (currentStep < RUN_STEPS.length && step.duration > 0) {
      activeSimulation = setTimeout(processStep, step.duration);
    }
  };
  
  // Start processing
  processStep();
}

export function continueAfterApproval(
  runId: string,
  onRunUpdate: RunUpdateCallback,
  onEvent: EventCallback
) {
  const runs = getDemoRuns();
  const runIndex = runs.findIndex(r => r.id === runId);
  if (runIndex === -1) return;

  const run = runs[runIndex];
  run.status = 'running';
  saveDemoRuns(runs);
  onRunUpdate({ ...run });
  
  // Add approval event
  const approvalEvent: DojoEvent = {
    id: `event-${Date.now()}-approved`,
    run_id: runId,
    ts: new Date().toISOString(),
    level: 'info',
    step: 8,
    message: 'Dojo Gate approved! Continuing...'
  };
  
  const events = getDemoEvents();
  events.push(approvalEvent);
  saveDemoEvents(events);
  onEvent(approvalEvent);
  
  // Continue with remaining steps (9 and 10)
  let currentStep = 8; // Index in RUN_STEPS array
  
  const processStep = () => {
    if (currentStep >= RUN_STEPS.length) {
      // Finalize run
      const finalRuns = getDemoRuns();
      const finalRun = finalRuns.find(r => r.id === runId);
      if (finalRun) {
        finalRun.status = 'completed';
        finalRun.finished_at = new Date().toISOString();
        finalRun.preview_url = 'https://demo-vibecoded-app.vercel.app';
        finalRun.shipdojo_score = calculateScore();
        finalRun.report_md = generateReportMarkdown(finalRun.shipdojo_score, getDemoChecks());
        saveDemoRuns(finalRuns);
        onRunUpdate({ ...finalRun });
        
        // Add completion event
        const completeEvent: DojoEvent = {
          id: `event-${Date.now()}-complete`,
          run_id: runId,
          ts: new Date().toISOString(),
          level: 'info',
          step: 10,
          message: `Run completed with score ${finalRun.shipdojo_score}/100`
        };
        events.push(completeEvent);
        saveDemoEvents(events);
        onEvent(completeEvent);
      }
      return;
    }
    
    const step = RUN_STEPS[currentStep];
    const updatedRuns = getDemoRuns();
    const updatedRun = updatedRuns.find(r => r.id === runId);
    if (!updatedRun) return;
    
    // Add event
    const event: DojoEvent = {
      id: `event-${Date.now()}-${step.step}`,
      run_id: runId,
      ts: new Date().toISOString(),
      level: 'info',
      step: step.step,
      message: `${step.name}...`
    };
    
    events.push(event);
    saveDemoEvents(events);
    onEvent(event);
    
    // Update run
    updatedRun.current_step = step.step;
    saveDemoRuns(updatedRuns);
    onRunUpdate({ ...updatedRun });
    
    currentStep++;
    
    if (currentStep < RUN_STEPS.length && step.duration > 0) {
      activeSimulation = setTimeout(processStep, step.duration);
    } else if (currentStep >= RUN_STEPS.length) {
      // Final step completed
      setTimeout(processStep, step.duration);
    }
  };
  
  // Start with step 9
  activeSimulation = setTimeout(processStep, 500);
}

function calculateScore(): number {
  const checks = getDemoChecks();
  const enabledChecks = checks.filter(c => c.enabled);
  const totalChecks = checks.length;
  
  // Base score from enabled checks
  const baseScore = Math.round((enabledChecks.length / totalChecks) * 70);
  
  // Bonus points
  const bonuses = 30; // Random bonus for demo
  
  return Math.min(100, baseScore + bonuses);
}

export function stopSimulation() {
  if (activeSimulation) {
    clearTimeout(activeSimulation);
    activeSimulation = null;
  }
}
