import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const categories = ['All', 'Tutoring', 'Training', 'Services', 'Equipment'];

const listings = [
  { id: '1', title: 'NCLEX-RN Tutoring', author: 'Sarah RN', price: '$50/hr', rating: 4.9, reviews: 127 },
  { id: '2', title: 'IV Therapy Training', author: 'Mike RN', price: '$150/session', rating: 4.8, reviews: 89 },
  { id: '3', title: 'Nursing Essay Editing', author: 'Dr. Emily', price: '$30/doc', rating: 4.7, reviews: 234 },
  { id: '4', title: 'Clinical Skills Bootcamp', author: 'Jennifer RN', price: '$299/course', rating: 4.9, reviews: 56 },
];

export default function MarketplaceScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Find nursing services</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.catBtn}>
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listings}>
        {listings.map((listing) => (
          <TouchableOpacity key={listing.id} style={styles.listingCard}>
            <View style={styles.listingHeader}>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <Text style={styles.listingPrice}>{listing.price}</Text>
            </View>
            <Text style={styles.listingAuthor}>by {listing.author}</Text>
            <View style={styles.listingFooter}>
              <Text style={styles.listingRating}>⭐ {listing.rating} ({listing.reviews} reviews)</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createBtnText}>+ Create Listing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#5568FE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catText: {
    color: '#64748b',
    fontWeight: '500',
  },
  listings: {
    padding: 16,
  },
  listingCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5568FE',
  },
  listingAuthor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingRating: {
    fontSize: 14,
    color: '#64748b',
  },
  viewBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewBtnText: {
    color: '#5568FE',
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: '#5568FE',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
