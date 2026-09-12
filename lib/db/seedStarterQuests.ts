import { getQuestsCollection } from "./collections";
import { Quest } from "@/types/quest";
import { calculateQuestReward } from "@/lib/rpg/engine";

export async function seedStarterQuests(userId: string): Promise<void> {
  const questsCollection = await getQuestsCollection();
  
  const starterTemplates = [
    {
      title: "Complete 30 minutes of coding or deep study",
      description: "Focus on uninterrupted problem solving or technical learning.",
      category: "Coding" as const,
      difficulty: "Medium" as const,
      attribute: "Intellect" as const,
    },
    {
      title: "Perform 20 push-ups or quick workout",
      description: "Engage your physical core and get your heart pumping.",
      category: "Fitness" as const,
      difficulty: "Easy" as const,
      attribute: "Strength" as const,
    },
    {
      title: "Read 10 pages of a book",
      description: "Expand your mental horizon through deliberate reading.",
      category: "Study" as const,
      difficulty: "Easy" as const,
      attribute: "Intellect" as const,
    },
    {
      title: "Drink 2 liters of water today",
      description: "Replenish your vitality with consistent hydration.",
      category: "Health" as const,
      difficulty: "Easy" as const,
      attribute: "Vitality" as const,
    },
    {
      title: "10-minute mindfulness or meditation",
      description: "Reset mental fatigue and strengthen mental discipline.",
      category: "Personal" as const,
      difficulty: "Easy" as const,
      attribute: "Discipline" as const,
    },
  ];

  const now = new Date();
  const docs = starterTemplates.map((item) => {
    const rewards = calculateQuestReward(item.difficulty);
    return {
      userId,
      title: item.title,
      description: item.description,
      category: item.category,
      difficulty: item.difficulty,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      attribute: item.attribute,
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  });

  await questsCollection.insertMany(docs);
}
