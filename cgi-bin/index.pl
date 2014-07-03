#!"C:\xampp\perl\bin\perl.exe"

use strict;
use warnings;
use CGI;
use lib "./lib";
use Users;
use Data::Dump qw(dump);
use JSON::PP;

my %RC = (
    200 => "Status: 200 OK",
    401 => "Status: 401 Unauthorized"
);

my $q = CGI->new();
my $method = lc($ENV{'REQUEST_METHOD'});
my $path = $ENV{'REQUEST_URI'};
my $data;

if (lc($method) eq 'post') {
    my $str = $q->param('POSTDATA');
    $data = JSON::PP->new->utf8->decode($str);
} elsif(lc($method) eq 'get') {
    my @params = $q->param;
    foreach my $k (@params) {
        $data->{$k} = $q->param($k);
    }
} else {
    print $q->header;
    print "method $method not supported";
    exit 0;
}
no strict "refs";
&$method($path, $data);
use strict "refs";

sub get {
 post(@_);    
    
}

sub post {
    my $path = shift;
    my $data = shift;
    my $users = Users->new();
    my $return = $users->get_users($data);
    print $q->header(-status => $return->{'code'}, -Content_type => 'application/json');
    
    my $response;
    if (ref($return->{'content'}) && ref($return->{'content'}) ne 'SCALAR') {
        $response = JSON::PP->new->utf8->encode($return->{'content'});
    } else {
        $response = $return->{'content'}
    }
    print $response;
}