class BarEntity:
    def __init__(self, bar_id, bar_name, bar_location, bar_detail=None, total_rating=0, total_reviews=0, bar_image=None):
        self.bar_id = bar_id
        self.bar_name = bar_name
        self.bar_location = bar_location
        self.bar_detail = bar_detail
        self.total_rating = total_rating
        self.total_reviews = total_reviews
        self.bar_image = bar_image 
