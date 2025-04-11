/**
 * Exercise Library Data
 * 
 * This module contains data for the exercise library.
 * Each exercise includes information about muscle groups, category,
 * intensity factors, and paths to images.
 * Image paths match the actual files in /public/images/exercises/
 */

const exerciseData = [
  // LOWER BODY EXERCISES
  {
    id: "back-squat",
    name: "Back Squat",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes", "Lower Back"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 1.0, // Standard intensity factor
    imagePath: "/images/exercises/Back-Squat.jpeg",
    description: "A compound lower-body exercise that targets the quadriceps, hamstrings, and glutes.",
    instructions: "1. Stand with feet shoulder-width apart\n2. Place barbell on upper back\n3. Bend knees and lower hips until thighs are parallel to floor\n4. Return to starting position",
    notes: "Key exercise for building lower body strength. Form is critical to prevent injury."
  },
  {
    id: "front-squat",
    name: "Front Squat",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes", "Core"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Front-Squat.jpeg",
    description: "A barbell squat variation with the weight held in front of the body, emphasizing the quadriceps and core.",
    instructions: "1. Position barbell across front shoulders\n2. Cross arms to secure bar or use clean grip\n3. Descend into squat keeping torso upright\n4. Drive through heels to return to standing",
    notes: "Excellent for quad development and core stability. Requires good ankle mobility."
  },
  {
    id: "leg-press",
    name: "Leg Press",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes"],
    category: "Strength",
    equipment: "Machine",
    baseIntensityFactor: 1.2, // Higher than squat as it's more isolated
    imagePath: "/images/exercises/Leg-Press.jpeg",
    description: "A machine-based compound exercise that targets the quadriceps with reduced lower back stress.",
    instructions: "1. Sit in the leg press machine\n2. Place feet shoulder-width apart on platform\n3. Lower weight by bending knees\n4. Push weight back up without locking knees",
    notes: "Good alternative to squats for players with back issues. Adjust foot position to target different muscle areas."
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    targetMuscleGroup: "Hamstrings",
    secondaryMuscles: ["Glutes", "Lower Back"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Romanian-Deadlift.jpeg",
    description: "A hip-hinge movement that targets the posterior chain, especially the hamstrings.",
    instructions: "1. Stand holding barbell at hip level\n2. Push hips back while maintaining slight knee bend\n3. Lower bar along legs until stretch in hamstrings\n4. Drive hips forward to return to standing",
    notes: "Focus on hip hinge rather than knee bend. Keep back flat throughout movement."
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    targetMuscleGroup: "Hamstrings",
    secondaryMuscles: [],
    category: "Isolation",
    equipment: "Machine",
    baseIntensityFactor: 0.8,
    imagePath: "/images/exercises/Leg-Curl.jpeg",
    description: "An isolation exercise targeting the hamstring muscles.",
    instructions: "1. Lie face down on machine\n2. Place ankles under pad\n3. Curl legs up by bending knees\n4. Return to starting position with control",
    notes: "Important for muscle balance with quadriceps. Focus on full range of motion."
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes", "Core"],
    category: "Strength",
    equipment: "Dumbbell",
    baseIntensityFactor: 0.8,
    imagePath: "/images/exercises/Bulgarian-Split-Squat.jpeg",
    description: "A unilateral lower body exercise that develops balance, coordination and strength.",
    instructions: "1. Stand with one foot on elevated surface behind you\n2. Lower into lunge position\n3. Keep front knee aligned with toes\n4. Push through front heel to return to start",
    notes: "Excellent for addressing strength imbalances between legs. Start with bodyweight before adding load."
  },
  {
    id: "lunges",
    name: "Lunges",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes"],
    category: "Strength",
    equipment: "Bodyweight",
    baseIntensityFactor: 0.7,
    imagePath: "/images/exercises/Lunges.jpeg",
    description: "A functional movement pattern that develops unilateral leg strength and stability.",
    instructions: "1. Stand with feet together\n2. Step forward with one leg into lunge position\n3. Lower until both knees are at 90 degrees\n4. Push back to starting position",
    notes: "Can be performed walking, stationary, or reverse. Add dumbbells or barbells for resistance."
  },
  
  // UPPER BODY EXERCISES - PUSH
  {
    id: "bench-press",
    name: "Bench Press",
    targetMuscleGroup: "Chest",
    secondaryMuscles: ["Triceps", "Shoulders"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 1.0,
    imagePath: "/images/exercises/Bench-Press.jpeg",
    description: "A compound pushing exercise that primarily targets the chest muscles.",
    instructions: "1. Lie on bench with feet flat on floor\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to mid-chest\n4. Press bar up until arms are extended",
    notes: "Fundamental upper body exercise. Use spotter when working with heavy weights."
  },
  {
    id: "incline-bench-press",
    name: "Incline Bench Press",
    targetMuscleGroup: "Chest",
    secondaryMuscles: ["Shoulders", "Triceps"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Incline-Bench-Press.jpeg",
    description: "A variation of the bench press performed on an inclined bench to target the upper chest.",
    instructions: "1. Lie on incline bench set to 30-45 degrees\n2. Grip bar slightly wider than shoulder width\n3. Lower bar to upper chest\n4. Press bar up until arms are extended",
    notes: "Great for developing the upper portion of the chest. Use slightly narrower grip than flat bench."
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    targetMuscleGroup: "Shoulders",
    secondaryMuscles: ["Triceps", "Trapezius"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.85,
    imagePath: "/images/exercises/Overhead-Press.jpeg",
    description: "A compound exercise targeting the deltoid muscles for shoulder development and overhead strength.",
    instructions: "1. Stand with bar at shoulder height\n2. Press bar overhead until arms are extended\n3. Lower bar with control to starting position\n4. Keep core tight throughout movement",
    notes: "Important for developing overhead strength. Avoid excessive arching of lower back."
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    targetMuscleGroup: "Triceps",
    secondaryMuscles: [],
    category: "Isolation",
    equipment: "Cable",
    baseIntensityFactor: 0.7,
    imagePath: "/images/exercises/Tricep-Pushdown.jpeg",
    description: "An isolation exercise that targets all three heads of the triceps.",
    instructions: "1. Face cable machine and grip attachment\n2. Keep elbows at sides\n3. Extend arms downward until straight\n4. Return to starting position with control",
    notes: "Effective for targeting triceps. Experiment with different attachments (rope, V-bar, straight bar)."
  },
  
  // UPPER BODY EXERCISES - PULL
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    targetMuscleGroup: "Back",
    secondaryMuscles: ["Biceps", "Shoulders"],
    category: "Strength",
    equipment: "Cable",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Lat-Pulldown.jpeg",
    description: "A compound pulling exercise that targets the latissimus dorsi muscles.",
    instructions: "1. Sit at pulldown machine\n2. Grip bar wider than shoulder width\n3. Pull bar down to chest while keeping back straight\n4. Slowly return to starting position",
    notes: "Essential for back width development. Focus on pulling with elbows, not hands."
  },
  {
    id: "seated-cable-row",
    name: "Seated Cable Row",
    targetMuscleGroup: "Back",
    secondaryMuscles: ["Biceps", "Shoulders"],
    category: "Strength",
    equipment: "Cable",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Seated-Cable-Row.jpeg",
    description: "A compound exercise that targets the middle back muscles.",
    instructions: "1. Sit at row machine with knees slightly bent\n2. Grip handles with arms extended\n3. Pull handles to torso while keeping back straight\n4. Return to starting position with control",
    notes: "Great for back thickness. Maintain upright posture throughout movement."
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    targetMuscleGroup: "Back",
    secondaryMuscles: ["Biceps", "Shoulders", "Lower Back"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.9,
    imagePath: "/images/exercises/Barbell-Row.jpeg",
    description: "A compound pulling exercise that builds back thickness and overall upper body strength.",
    instructions: "1. Bend at hips with slight knee bend\n2. Hold barbell with overhand grip\n3. Pull bar to lower chest/upper abdomen\n4. Lower with control to arms extended",
    notes: "Keep back flat and core engaged. Can be performed with underhand grip to target biceps more."
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    targetMuscleGroup: "Back",
    secondaryMuscles: ["Biceps", "Shoulders"],
    category: "Bodyweight",
    equipment: "Pull-Up Bar",
    baseIntensityFactor: 0.8,
    imagePath: "/images/exercises/Pull-Ups.jpeg",
    description: "A fundamental bodyweight exercise for upper body pulling strength.",
    instructions: "1. Hang from bar with overhand grip\n2. Pull body up until chin over bar\n3. Lower with control to starting position\n4. Maintain straight body position throughout",
    notes: "One of the best exercises for back development. Use assisted version if needed for proper form."
  },
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    targetMuscleGroup: "Biceps",
    secondaryMuscles: ["Forearms"],
    category: "Isolation",
    equipment: "Dumbbells",
    baseIntensityFactor: 0.7,
    imagePath: "/images/exercises/Bicep-Curl.jpeg",
    description: "An isolation exercise targeting the biceps muscles.",
    instructions: "1. Stand with dumbbells at sides\n2. Curl weights up while keeping elbows stationary\n3. Squeeze biceps at top\n4. Lower weights with control",
    notes: "Focus on controlled movement rather than heavy weight to maximize bicep activation."
  },
  
  // PLYOMETRIC EXERCISES
  {
    id: "box-jumps",
    name: "Box Jumps",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes", "Calves"],
    category: "Plyometric",
    equipment: "Box",
    baseIntensityFactor: 0.6, // Lower as it's bodyweight
    imagePath: "/images/exercises/Box-Jumps.jpeg",
    description: "A plyometric exercise that builds explosive power in the lower body.",
    instructions: "1. Stand facing box with feet shoulder-width apart\n2. Swing arms and bend knees\n3. Jump onto box, landing softly with both feet\n4. Step back down and repeat",
    notes: "Great for developing explosiveness. Ensure box is stable before performing."
  },
  {
    id: "jump-squats",
    name: "Jump Squats",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Hamstrings", "Glutes", "Calves"],
    category: "Plyometric",
    equipment: "Bodyweight",
    baseIntensityFactor: 0.5,
    imagePath: "/images/exercises/Jump-Squats.jpeg",
    description: "A plyometric exercise that builds explosive strength in the legs.",
    instructions: "1. Stand with feet shoulder-width apart\n2. Lower into squat position\n3. Explode upward into a jump\n4. Land softly and immediately lower into next rep",
    notes: "Excellent for basketball-specific power. Focus on soft landings to protect joints."
  },
  
  // CORE EXERCISES
  {
    id: "plank",
    name: "Plank",
    targetMuscleGroup: "Core",
    secondaryMuscles: ["Shoulders", "Lower Back"],
    category: "Core Stability",
    equipment: "Bodyweight",
    baseIntensityFactor: 0.4,
    imagePath: "/images/exercises/Plank.jpeg",
    description: "An isometric core exercise that builds abdominal and overall core stability.",
    instructions: "1. Start in push-up position with forearms on ground\n2. Keep body straight from head to heels\n3. Engage core and hold position\n4. Breathe normally throughout",
    notes: "Focus on maintaining proper form rather than duration. Add variations as strength improves."
  },
  {
    id: "russian-twists",
    name: "Russian Twists",
    targetMuscleGroup: "Core",
    secondaryMuscles: ["Obliques"],
    category: "Core Rotation",
    equipment: "Medicine Ball",
    baseIntensityFactor: 0.5,
    imagePath: "/images/exercises/Russian-Twists.jpeg",
    description: "A rotational core exercise that targets the obliques and deep abdominal muscles.",
    instructions: "1. Sit with knees bent and feet elevated\n2. Hold weight at chest\n3. Rotate torso to touch weight to ground on each side\n4. Maintain elevated feet throughout",
    notes: "Important for developing rotational power needed in basketball movements."
  },
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    targetMuscleGroup: "Glutes",
    secondaryMuscles: ["Hamstrings", "Lower Back"],
    category: "Strength",
    equipment: "Barbell",
    baseIntensityFactor: 0.85,
    imagePath: "/images/exercises/HipThrust.jpeg",
    description: "A focused glute exercise that develops power for jumping and sprinting.",
    instructions: "1. Sit on ground with upper back against bench\n2. Place barbell across hips\n3. Drive through heels to lift hips to full extension\n4. Lower with control and repeat",
    notes: "One of the best exercises for glute development. Essential for athletic power production."
  },
  {
    id: "wall-sit",
    name: "Wall Sit",
    targetMuscleGroup: "Quadriceps",
    secondaryMuscles: ["Glutes", "Calves"],
    category: "Isometric",
    equipment: "Bodyweight",
    baseIntensityFactor: 0.5,
    imagePath: "/images/exercises/Wall-Sit.jpeg",
    description: "An isometric exercise that builds leg endurance and static strength.",
    instructions: "1. Stand with back against wall\n2. Lower into seated position with thighs parallel to floor\n3. Keep knees at 90 degrees\n4. Hold position as long as possible",
    notes: "Great for building endurance in defensive stance. Can be progressed by adding weights on lap."
  }
];

// Get all available muscle groups
export const getAllMuscleGroups = () => {
  const primaryMuscles = exerciseData.map(exercise => exercise.targetMuscleGroup);
  const secondaryMuscles = exerciseData.flatMap(exercise => exercise.secondaryMuscles || []);
  
  // Combine and remove duplicates
  return [...new Set([...primaryMuscles, ...secondaryMuscles])].sort();
};

// Get all available categories
export const getAllCategories = () => {
  const categories = exerciseData.map(exercise => exercise.category);
  return [...new Set(categories)].sort();
};

// Get all available equipment types
export const getAllEquipment = () => {
  const equipment = exerciseData.map(exercise => exercise.equipment);
  return [...new Set(equipment)].sort();
};

export default exerciseData;