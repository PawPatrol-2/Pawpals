import mongoose from 'mongoose';

export type AnimalStatus = 'Tillgänglig' | 'Adopterad';

const animalSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['Tillgänglig', 'Adopterad'], default: 'Tillgänglig' },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: false },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    keyTraits: { type: String, required: false },
    personality: { type: String, required: false },
    description: { type: String, required: false },
    city: { type: String, required: true },
    childFriendly: { type: Boolean, required: false, default: false },
    organizationOwner: { type: String, required: false },
    likes: { type: [String], required: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

animalSchema.pre(/^find/, async function (this: mongoose.Query<unknown, unknown>) {
  this.where({ deletedAt: null });
});

// Hard delete automatically efter 30 dagar efter soft delete
animalSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 2592000, partialFilterExpression: { deletedAt: { $type: 'date' } } },
);

export const Animal = mongoose.model('Animal', animalSchema);
